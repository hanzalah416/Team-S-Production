import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function OutlinedAlerts() {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert variant="outlined" severity="info">
                This is an admin only dataset. If you are not an admin, please log out and report this immediately.
            </Alert>
        </Stack>
    );
}
