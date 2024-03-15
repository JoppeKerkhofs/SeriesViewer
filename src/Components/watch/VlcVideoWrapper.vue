<!-- VlcVideoWrapper.vue -->
<template>
	<vlc-video :src="src" controls></vlc-video>
</template>

<script>
import VlcVideo from "vlc-video";

export default {
	components: {
		VlcVideo,
	},
	props: {
		src: String,
		width: String,
		height: String,
	},
};
</script>
