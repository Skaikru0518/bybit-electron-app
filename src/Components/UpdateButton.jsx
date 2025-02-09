import { useEffect, useState } from 'react';

function UpdateButton() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [version, setVersion] = useState(null);

    useEffect(() => {
        if (!window.bybitAPI) {
            console.error("❌ window.bybitAPI is undefined!");
            return;
        }

        // Listen for update status from Electron
        window.bybitAPI.onUpdateStatus(({ available, version }) => {
            setUpdateAvailable(available);
            if (available) setVersion(version);
        });

        // Check update status on mount
        const checkUpdate = async () => {
            try {
                const isAvailable = await window.bybitAPI.checkForUpdates();
                setUpdateAvailable(isAvailable);
            } catch (error) {
                console.error("❌ Error checking for updates:", error);
            }
        };

        checkUpdate();
    }, []);

    return (
        <button className="p-3 bg-btn text-white rounded-xl hover:bg-btn-hover transition-all duration-300">
            {updateAvailable ? `Update to ${version} 🚀` : 'Up to Date ✅'}
        </button>
    );
}

export default UpdateButton;
