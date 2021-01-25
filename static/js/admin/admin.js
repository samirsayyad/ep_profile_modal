// var shared = require('../shared');

const documentReady = (() => {

	const documentReady = (hooks, context, cb) => {
		if (context !== 'admin/ep_profile_modal') {
			return [];
		}
	
		let socket;
		const loc = document.location;
		const port = loc.port == '' ? (loc.protocol == 'https:' ? 443 : 80) : loc.port;
		const url = `${loc.protocol}//${loc.hostname}:${port}/`;
		const pathComponents = location.pathname.split('/');
		// Strip admin/plugins
		const baseURL = `${pathComponents.slice(0, pathComponents.length - 2).join('/')}/`;
		const resource = `${baseURL.substring(1)}socket.io`;
	
		const room = `${url}pluginfw/admin/ep_profile_modal`;
	
		let changeTimer;
	
	
		// connect
		socket = io.connect(room, {path: `${baseURL}socket.io`, resource});
		socket.on('load-settings-result', (data) => {
			console.log(data);
			shared.setFormData($('#settings-form'), data);
		});
	
		$('#save-settings').on('click', () => {
			const data = shared.getFormData($('#settings-form'));
			console.log(data, 'data');
			socket.emit('save-settings', data);
			alert('Succesfully saved.');
		});
	
		socket.emit('load-settings');
	
	
		return [];
	};

	return documentReady
})();
