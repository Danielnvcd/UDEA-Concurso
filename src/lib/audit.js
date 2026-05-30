import { supabase } from './supabase';

// Inserta una entrada en audit_logs. No bloquea ni lanza: si falla, solo loguea
// en consola. La RLS exige is_admin(), asi que usar solo desde rutas admin.
export const logAdminAction = async (action, entityType, entityId, metadata = null) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert({
      admin_user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata
    });
  } catch (err) {
    console.warn('audit_logs insert failed:', err);
  }
};
