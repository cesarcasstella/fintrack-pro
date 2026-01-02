"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, MessageCircle, CheckCircle, Loader2, Phone, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Profile } from "@/types/database";
import { theme } from "@/components/ui/design-system";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center -m-4 md:-m-6">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -m-4 md:-m-6">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link
            href="/settings"
            className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">WhatsApp</h1>
            <p className="text-sm text-gray-500">Registra transacciones por mensaje</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* WhatsApp CTA Banner */}
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-lg">Modo WhatsApp</h4>
              <p className="text-white/80 text-sm">Envía &quot;Almuerzo 25k&quot; para registrar</p>
            </div>
          </div>
        </div>

        {/* Enable Toggle Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Habilitar WhatsApp</p>
              <p className="text-sm text-gray-500">Permite registrar transacciones por mensajes</p>
            </div>
            <button
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                whatsappEnabled ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  whatsappEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Phone Number Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Número de WhatsApp
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="+573001234567"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Incluye el código de país (ej: +57 para Colombia)
          </p>
        </div>

        {/* Verification Status */}
        {phoneNumber && (
          <div className={`rounded-2xl p-4 ${whatsappVerified ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`}>
            {whatsappVerified ? (
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Número verificado</span>
              </div>
            ) : (
              <div>
                <p className="text-amber-800 font-medium">Número no verificado</p>
                <p className="text-sm text-amber-700 mt-1">
                  Para verificar, envía un mensaje con &quot;VERIFICAR&quot; al número de FinTrack Pro.
                </p>
              </div>
            )}
          </div>
        )}

        {/* How it works Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">¿Cómo funciona?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Guarda el número <strong className="text-gray-900">+1 (415) 523-8886</strong> en tus contactos como &quot;FinTrack Pro&quot;
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="text-sm text-gray-700 mb-2">Envía mensajes naturales como:</p>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  <p className="font-mono text-sm text-gray-600">&quot;Almuerzo 25000&quot;</p>
                  <p className="font-mono text-sm text-gray-600">&quot;Taxi al trabajo 15k&quot;</p>
                  <p className="font-mono text-sm text-gray-600">&quot;Ingreso 1500000 salario&quot;</p>
                  <p className="font-mono text-sm text-gray-600">&quot;Balance&quot;</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <p className="text-sm text-gray-700">
                FinTrack Pro registrará automáticamente tus transacciones y te confirmará por WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] hover:shadow-lg hover:shadow-emerald-500/25"
          style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)` }}
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
  );
}
