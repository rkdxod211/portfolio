import React, { useRef, useState } from 'react';
import { Upload, RotateCcw, FileText } from 'lucide-react';
import { adminFetch } from '../adminApi';
import { DEFAULT_ASSETS } from '../siteAssets';

// The backend (on Vercel) accepts at most 4 MB per upload.
const MAX_BYTES = 4 * 1024 * 1024;

const SLOTS = [
    { key: 'profile', label: 'Profile Photo', kind: 'image', maxSide: 800, accept: 'image/jpeg,image/png,image/webp,image/gif' },
    { key: 'background', label: 'Background Image', kind: 'image', maxSide: 2560, accept: 'image/jpeg,image/png,image/webp' },
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

// Admin: replace the profile photo, background image and resume file.
export default function SiteAssets({ assets, onAssetsChange }) {
    const [busy, setBusy] = useState(null); // key being uploaded/reset

    const upload = async (slot, file) => {
        setBusy(slot.key);
        try {
            const body = slot.kind === 'image' ? await prepareImage(file, slot.maxSide) : file;
            if (body.size > MAX_BYTES) throw new Error('File is too large (max 4 MB)');
            const res = await adminFetch(`/api/assets/${slot.key}`, {
                method: 'PUT',
                headers: { 'Content-Type': body.type },
                body
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            onAssetsChange(prev => ({ ...prev, [slot.key]: data.url }));
        } catch (err) {
            alert('ERROR: ' + err.message);
        } finally {
            setBusy(null);
        }
    };

    const reset = async (slot) => {
        if (!window.confirm(`Go back to the default ${slot.label.toLowerCase()}?`)) return;
        setBusy(slot.key);
        try {
            const res = await adminFetch(`/api/assets/${slot.key}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Reset failed');
            onAssetsChange(prev => ({ ...prev, [slot.key]: null }));
        } catch (err) {
            alert('ERROR: ' + err.message);
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2 className="section-title">Images &amp; Files</h2>
            </div>
            <div className="asset-grid">
                {SLOTS.map(slot => (
                    <AssetCard
                        key={slot.key}
                        slot={slot}
                        url={assets?.[slot.key] || DEFAULT_ASSETS[slot.key]}
                        isCustom={Boolean(assets?.[slot.key])}
                        busy={busy === slot.key}
                        disabled={busy !== null}
                        onPick={(file) => upload(slot, file)}
                        onReset={() => reset(slot)}
                    />
                ))}
            </div>
        </div>
    );
}

function AssetCard({ slot, url, isCustom, busy, disabled, onPick, onReset }) {
    const inputRef = useRef(null);

    return (
        <div className="asset-card">
            <label className="admin-label">{slot.label}</label>
            <div className={`asset-preview asset-preview-${slot.key}`}>
                {slot.kind === 'image' ? (
                    <img src={url} alt={slot.label} />
                ) : (
                    <a href={url} target="_blank" rel="noreferrer" className="asset-file-link">
                        <FileText size={40} />
                        <span>Open current PDF</span>
                    </a>
                )}
            </div>
            <p className="asset-status">{busy ? 'Uploading…' : isCustom ? 'Custom upload' : 'Default file'}</p>
            <div className="asset-actions">
                <button className="btn-edit" disabled={disabled} onClick={() => inputRef.current?.click()}>
                    <Upload size={16} /> Change
                </button>
                {isCustom && (
                    <button className="btn-cancel" disabled={disabled} onClick={onReset} title="Use the default file again">
                        <RotateCcw size={16} /> Reset
                    </button>
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
                    if (file) onPick(file);
                }}
            />
        </div>
    );
}
