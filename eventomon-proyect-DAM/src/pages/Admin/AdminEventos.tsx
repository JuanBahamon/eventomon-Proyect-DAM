import React, { useState, useEffect, useRef } from 'react';
import {
    IonPage, IonContent, IonButton, IonIcon, IonSpinner,
    IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonToast, IonAlert, IonModal, IonHeader, IonToolbar, IonTitle,
} from '@ionic/react';
import {
    addOutline, createOutline, trashOutline,
    cloudUploadOutline, closeOutline,
} from 'ionicons/icons';
import { ref as dbRef, onValue, push, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../helpers/Firebase';
import styles from './AdminEventos.module.scss';

interface EventoForm {
    title: string;
    description: string;
    category: string;
    date: string;
    place: string;
    price: number;
    image: string;
    attendees: number;
}

interface Evento extends EventoForm {
    id: string;
}

const CATEGORIAS = ['Música', 'Deportes', 'Arte', 'Tecnología', 'Gastronomía', 'Teatro', 'Otro'];

const emptyForm: EventoForm = {
    title: '', description: '', category: '', date: '',
    place: '', price: 0, image: '', attendees: 0,
};

const AdminEventos: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<EventoForm>(emptyForm);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', color: 'success' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Cargar eventos desde Firebase ──────────────────────────────
    useEffect(() => {
        const eventosRef = dbRef(db, 'events');
        const unsub = onValue(eventosRef, (snap) => {
            const data = snap.val();
            if (data) {
                const list: Evento[] = Object.entries(data).map(([id, val]) => ({
                    ...(val as EventoForm),
                    id,
                }));
                setEventos(list.reverse());
            } else {
                setEventos([]);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // ── Subir imagen a Firebase Storage ────────────────────────────
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const path = `events/${Date.now()}_${file.name}`;
            const imgRef = storageRef(storage, path);
            await uploadBytes(imgRef, file);
            const url = await getDownloadURL(imgRef);
            setForm((f) => ({ ...f, image: url }));
            showToast('Imagen subida ✅', 'success');
        } catch {
            showToast('Error al subir la imagen', 'danger');
        } finally {
            setUploadingImage(false);
        }
    };

    // ── Guardar (crear o editar) ────────────────────────────────────
    const handleSave = async () => {
        if (!form.title || !form.date || !form.place || !form.category) {
            showToast('Completa los campos obligatorios', 'warning');
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await update(dbRef(db, `events/${editingId}`), { ...form });
                showToast('Evento actualizado ✅', 'success');
            } else {
                await push(dbRef(db, 'events'), { ...form, attendees: 0 });
                showToast('Evento creado ✅', 'success');
            }
            closeModal();
        } catch {
            showToast('Error al guardar el evento', 'danger');
        } finally {
            setSaving(false);
        }
    };

    // ── Eliminar ────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await remove(dbRef(db, `events/${deletingId}`));
            showToast('Evento eliminado', 'success');
        } catch {
            showToast('Error al eliminar', 'danger');
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helpers ────────────────────────────────────────────────────
    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (ev: Evento) => {
        setEditingId(ev.id);
        setForm({
            title: ev.title, description: ev.description, category: ev.category,
            date: ev.date, place: ev.place, price: ev.price,
            image: ev.image, attendees: ev.attendees,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const showToast = (message: string, color: string) =>
        setToast({ open: true, message, color });

    const setField = (key: keyof EventoForm, val: any) =>
        setForm((f) => ({ ...f, [key]: val }));

    // ── UI ─────────────────────────────────────────────────────────
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Panel de Eventos</IonTitle>
                    <IonButton slot="end" onClick={openCreate} style={{ marginRight: 8 }}>
                        <IonIcon icon={addOutline} slot="start" />
                        Nuevo
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent style={{ '--background': '#f4f4f4' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
                        <IonSpinner name="crescent" />
                    </div>
                ) : eventos.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 80, color: '#888' }}>
                        <p style={{ fontSize: 48 }}>🎪</p>
                        <p>No hay eventos aún.</p>
                        <IonButton onClick={openCreate}>Crear el primero</IonButton>
                    </div>
                ) : (
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {eventos.map((ev) => (
                            <div
                                key={ev.id}
                                style={{
                                    background: '#fff', borderRadius: 16, overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    display: 'flex', alignItems: 'center', gap: 12,
                                }}
                            >
                                {ev.image ? (
                                    <img
                                        src={ev.image}
                                        alt={ev.title}
                                        style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0 }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 80, height: 80, background: '#e0e0e0',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 28, flexShrink: 0,
                                        }}
                                    >
                                        🎪
                                    </div>
                                )}
                                <div style={{ flex: 1, padding: '8px 0' }}>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{ev.title}</p>
                                    <p style={{ margin: '2px 0', fontSize: 12, color: '#888' }}>
                                        {ev.category} · {ev.date}
                                    </p>
                                    <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{ev.place}</p>
                                    <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#6c47ff', fontSize: 14 }}>
                                        ${ev.price.toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 12 }}>
                                    <IonButton
                                        size="small" fill="outline" color="primary"
                                        onClick={() => openEdit(ev)}
                                        style={{ '--border-radius': '8px' }}
                                    >
                                        <IonIcon icon={createOutline} />
                                    </IonButton>
                                    <IonButton
                                        size="small" fill="outline" color="danger"
                                        onClick={() => setDeletingId(ev.id)}
                                        style={{ '--border-radius': '8px' }}
                                    >
                                        <IonIcon icon={trashOutline} />
                                    </IonButton>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Modal Crear / Editar ───────────────────────────── */}
                <IonModal isOpen={modalOpen} onDidDismiss={closeModal}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{editingId ? 'Editar Evento' : 'Nuevo Evento'}</IonTitle>
                            <IonButton slot="end" fill="clear" onClick={closeModal}>
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent style={{ '--padding-top': '16px' }}>
                        <div style={{ padding: '0 16px 80px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                            {/* Imagen */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                                    background: '#f0f0f0', height: 160,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative',
                                }}
                            >
                                {form.image ? (
                                    <img src={form.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#aaa' }}>
                                        <IonIcon icon={cloudUploadOutline} style={{ fontSize: 36 }} />
                                        <p style={{ margin: 4, fontSize: 13 }}>Subir foto del evento</p>
                                    </div>
                                )}
                                {uploadingImage && (
                                    <div style={{
                                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <IonSpinner name="crescent" color="light" />
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />

                            <Field label="Título *">
                                <IonInput
                                    value={form.title}
                                    onIonChange={(e) => setField('title', e.detail.value!)}
                                    placeholder="Nombre del evento"
                                />
                            </Field>

                            <Field label="Descripción">
                                <IonTextarea
                                    value={form.description}
                                    onIonChange={(e) => setField('description', e.detail.value!)}
                                    placeholder="Descripción del evento"
                                    rows={3}
                                />
                            </Field>

                            <Field label="Categoría *">
                                <IonSelect
                                    value={form.category}
                                    onIonChange={(e) => setField('category', e.detail.value)}
                                    placeholder="Seleccionar"
                                >
                                    {CATEGORIAS.map((c) => (
                                        <IonSelectOption key={c} value={c}>{c}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </Field>

                            <Field label="Fecha *">
                                <IonInput
                                    type="date"
                                    value={form.date}
                                    onIonChange={(e) => setField('date', e.detail.value!)}
                                />
                            </Field>

                            <Field label="Lugar *">
                                <IonInput
                                    value={form.place}
                                    onIonChange={(e) => setField('place', e.detail.value!)}
                                    placeholder="Nombre del lugar"
                                />
                            </Field>

                            <Field label="Precio (COP)">
                                <IonInput
                                    type="number"
                                    value={form.price}
                                    onIonChange={(e) => setField('price', Number(e.detail.value))}
                                    placeholder="0"
                                />
                            </Field>

                            <IonButton
                                expand="block"
                                onClick={handleSave}
                                disabled={saving || uploadingImage}
                                style={{ '--border-radius': '12px', marginTop: 8 }}
                            >
                                {saving ? <IonSpinner name="crescent" /> : (editingId ? 'Guardar cambios' : 'Crear evento')}
                            </IonButton>
                        </div>
                    </IonContent>
                </IonModal>

                {/* ── Alert Eliminar ─────────────────────────────────── */}
                <IonAlert
                    isOpen={!!deletingId}
                    header="¿Eliminar evento?"
                    message="Esta acción no se puede deshacer."
                    buttons={[
                        { text: 'Cancelar', role: 'cancel', handler: () => setDeletingId(null) },
                        { text: 'Eliminar', role: 'destructive', handler: handleDelete },
                    ]}
                    onDidDismiss={() => setDeletingId(null)}
                />

                <IonToast
                    isOpen={toast.open}
                    message={toast.message}
                    duration={2000}
                    color={toast.color}
                    onDidDismiss={() => setToast({ ...toast, open: false })}
                />
            </IonContent>
        </IonPage>
    );
};

// Helper para los campos del formulario
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#555' }}>{label}</p>
        <div style={{
            background: '#f7f7f7', borderRadius: 10, padding: '2px 12px',
            border: '1px solid #e0e0e0',
        }}>
            {children}
        </div>
    </div>
);

export default AdminEventos;