<template>
    <div id="uppy">
      <!-- Uppy will attach the dashboard here -->
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import GoogleDrive from '@uppy/google-drive';
import Tus from '@uppy/tus';
import DropTarget from '@uppy/drop-target';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

onMounted(() => {
    const uppy = new Uppy({
        debug: true,
        autoProceed: false,
    })
    .use(Dashboard, {
        inline: true,
        target: '#uppy',
        proudlyDisplayPoweredByUppy: false,
        disableThumbnailGenerator: true
    })
    .use(GoogleDrive, {
        target: Dashboard,
        companionUrl: 'https://companion.uppy.io',
    })
    .use(Tus, {
        endpoint: 'https://tusd.tusdemo.net/files/', // Example endpoint
    })
    .use(DropTarget, {
        target: document.body,
    });

    uppy.on('complete', (result) => {
        console.log('Upload complete! We’ve uploaded these files:', result.successful);
    });
});
</script>