"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, MessageSquare, CheckCircle, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { Profile } from "@/types/database";

export default function WhatsAppSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappVerified, setWhatsappVerified] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("phone_number, whatsapp_enabled, whatsapp_verified")
        .eq("id", user.id)
        .single() as { data: Pick<Profile, "phone_number" | "whatsapp_enabled" | "whatsapp_verified"> | null };

      if (profile) {
        setPhoneNumber(profile.phone_number || "");
        setWhatsappEnabled(profile.whatsapp_enabled || false);
        setWhatsappVerified(profile.whatsapp_verified || false);
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("No estás autenticado");
      setSaving(false);
      return;
    }

    // Validate phone number format
    const cleanedPhone = phoneNumber.replace(/\s+/g, "").replace(/-/g, "");
    if (cleanedPhone && !cleanedPhone.match(/^\+?[1-9]\d{6,14}$/)) {
      toast.error("Formato de teléfono inválido. Usa formato internacional: +57XXXXXXXXXX");
      setSaving(false);
      return;
    }

    const { error } = await (supabase
      .from("profiles") as any)
      .update({
        phone_number: cleanedPhone || null,
        whatsapp_enabled: whatsappEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Error al guardar la configuración");
      console.error(error);
    } else {
      toast.success("Configuración guardada");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a configuración
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WhatsApp</h1>
              <p className="text-gray-600">
                Registra transacciones enviando mensajes por WhatsApp
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Habilitar WhatsApp</p>
              <p className="text-sm text-gray-500">
                Permite registrar transacciones por mensajes
              </p>
            </div>
            <button
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                whatsappEnabled ? "bg-green-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  whatsappEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="+573001234567"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Incluye el código de país (ej: +57 para Colombia)
            </p>
          </div>

          {/* Verification Status */}
          {phoneNumber && (
            <div className={`rounded-lg p-4 ${whatsappVerified ? "bg-green-50" : "bg-yellow-50"}`}>
              {whatsappVerified ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Número verificado</span>
                </div>
              ) : (
                <div>
                  <p className="text-yellow-800 font-medium">Número no verificado</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Para verificar, envía un mensaje con &quot;VERIFICAR&quot; al número de FinTrack Pro.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* How it works */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-3">¿Cómo funciona?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <p>
                  Guarda el número <strong>+1 (415) 523-8886</strong> en tus contactos como
                  &quot;FinTrack Pro&quot;
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <p>
                  Envía mensajes naturales como:
                </p>
              </div>
              <div className="ml-9 bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="font-mono text-sm">&quot;Almuerzo 25000&quot;</p>
                <p className="font-mono text-sm">&quot;Taxi al trabajo 15k&quot;</p>
                <p className="font-mono text-sm">&quot;Ingreso 1500000 salario&quot;</p>
                <p className="font-mono text-sm">&quot;Balance&quot;</p>
                <p className="font-mono text-sm">&quot;Resumen&quot;</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <p>
                  FinTrack Pro registrará automáticamente tus transacciones y te confirmará por WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Configuración"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
