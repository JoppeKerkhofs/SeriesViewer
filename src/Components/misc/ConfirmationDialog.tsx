import React from 'react';

interface ConfirmationDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
    const { message, onConfirm, onCancel } = props;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-lg">
            <div className="bg-white p-4 rounded-lg mx-2">
                <p>{message}</p>
                <div className="mt-4 flex justify-end">
                    <button className="mr-2 bg-red-500 text-white px-4 py-2 rounded-lg" onClick={onConfirm}>
                        Confirm
                    </button>
                    <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}