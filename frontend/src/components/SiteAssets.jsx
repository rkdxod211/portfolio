import React, { useEffect, useRef, useState } from 'react';
import { Upload, RotateCcw, FileText, Save, X } from 'lucide-react';
import { adminFetch } from '../adminApi';

// The backend (on Vercel) accepts at most 4 MB per upload.
const MAX_BYTES = 4 * 1024 * 1024;

const SLOTS = [
    { key: 'profile', label: 'Profile Photo', kind: 'image', maxSide: 800, accept: 'image/jpeg,image/png,image/webp,image/gif' },
    { key: 'resume', label: 'Resume (PDF)', kind: 'pdf', accept: 'application/pdf' }
];

const loadImage = (file) => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that image')); };
    img.src = url;
});

// Shrink big photos (e.g. straight from a phone) so they load fast and fit the upload limit.
async function prepareImage(file, maxSide) {
    const img = await loadImage(file);
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1 && file.size <= MAX_BYTES) return file;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.88));
    if (!blob) throw new Error('Could not process that image');
    return blob;
}

// Admin: replace the profile photo and resume file.
export default function SiteAssets({ assets, onAssetsChange }) {
    return (
        <div className="admin-section">
            <div className="section-header">
                <h2 className="section-title">Profile Photo &amp; Resume</h2>
            </div>
            <div className="asset-grid">
                {SLOTS.map(slot => (
                    <AssetCard
                        key={slot.key}
                        slot={slot}
                        url={assets?.[slot.key] || null}
                        onSaved={(url) => onAssetsChange(prev => ({ ...prev, [slot.key]: url }))}
                    />
                ))}
            </div>
        </div>
    );
}

function AssetCard({ slot, url, onSaved }) {
    const inputRef = useRef(null);
    const [pending, setPending] = useState(null); // { body, previewUrl, name } picked but not saved yet
    const [busy, setBusy] = useState(null); // 'saving' | 'resetting'

    // Free the local preview URL when it is replaced or the card goes away.
    useEffect(() => () => { if (pending) URL.revokeObjectURL(pending.previewUrl); }, [pending]);

    const pick = async (file) => {
        try {
            const body = slot.kind === 'image' ? await prepareImage(file, slot.maxSide) : file;
            if (body.size > MAX_BYTES) throw new Error('File is too large (max 4 MB)');
            setPending({ body, previewUrl: URL.createObjectURL(body), name: file.name });
        } catch (err) {
            alert('ERROR: ' + err.message);
        }
    };

    const save = async () => {
        setBusy('saving');
        try {
            const res = await adminFetch(`/api/assets/${slot.key}`, {
                method: 'PUT',
                headers: { 'Content-Type': pending.body.type },
                body: pending.body
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            onSaved(data.url);
            setPending(null);
        } catch (err) {
            alert('ERROR: ' + err.message);
        } finally {
            setBusy(null);
        }
    };

    const reset = async () => {
        const what = slot.kind === 'image' ? 'Remove the profile photo?' : 'Remove the resume from the site?';
        if (!window.confirm(what)) return;
        setBusy('resetting');
        try {
            const res = await adminFetch(`/api/assets/${slot.key}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Reset failed');
            onSaved(null);
        } catch (err) {
            alert('ERROR: ' + err.message);
        } finally {
            setBusy(null);
        }
    };

    const shownUrl = pending ? pending.previewUrl : url;
    const status = busy === 'saving' ? 'Saving…'
        : busy === 'resetting' ? 'Removing…'
        : pending ? `New: ${pending.name} (not saved)`
        : url ? 'Current'
        : slot.kind === 'image' ? 'No photo' : 'No resume';

    return (
        <div className="asset-card">
            <label className="admin-label">{slot.label}</label>
            <div className={`asset-preview asset-preview-${slot.key}`}>
                {slot.kind === 'image' ? (
                    shownUrl
                        ? <img src={shownUrl} alt={slot.label} />
                        : <div className="profile-placeholder" />
                ) : shownUrl ? (
                    <a href={shownUrl} target="_blank" rel="noreferrer" className="asset-file-link">
                        <FileText size={40} />
                        <span>{pending ? 'Preview new PDF' : 'Open current PDF'}</span>
                    </a>
                ) : (
                    <span className="asset-empty">No resume uploaded</span>
                )}
            </div>
            <p className="asset-status">{status}</p>
            <div className="asset-actions">
                {pending ? (
                    <>
                        <button className="btn-save" disabled={busy !== null} onClick={save}>
                            <Save size={16} /> Save
                        </button>
                        <button className="btn-cancel" disabled={busy !== null} onClick={() => setPending(null)}>
                            <X size={16} /> Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn-edit" disabled={busy !== null} onClick={() => inputRef.current?.click()}>
                            <Upload size={16} /> {url ? 'Change' : 'Upload'}
                        </button>
                        {url && (
                            <button className="btn-cancel" disabled={busy !== null} onClick={reset}>
                                <RotateCcw size={16} /> Reset
                            </button>
                        )}
                    </>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={slot.accept}
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = ''; // allow picking the same file again
                    if (file) pick(file);
                }}
            />
        </div>
    );
}
