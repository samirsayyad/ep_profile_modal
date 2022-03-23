/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';


const documentReady = (() => {
  const documentReady = (hooks, context, cb) => {
    let socket;
    const loc = document.location;
    const port = loc.port === '' ? (loc.protocol === 'https:' ? 443 : 80) : loc.port;
    const url = `${loc.protocol}//${loc.hostname}:${port}/`;
    const pathComponents = location.pathname.split('/');
    // Strip admin/plugins
    const baseURL = `${pathComponents.slice(0, pathComponents.length - 2).join('/')}/`;
    const resource = `${baseURL.substring(1)}socket.io`;

    const room = `${url}pluginfw/admin/ep_profile_modal`;

    switch (context) {
      case 'admin/ep_profile_modal': {
        // connect
        socket = io.connect(room, {path: `${baseURL}socket.io`, resource});
        socket.on('load-settings-result', (data) => {
          shared.setFormData($('#settings-form'), data);
        });

        $('#save-settings').on('click', () => {
          const data = shared.getFormData($('#settings-form'));
          socket.emit('save-settings', data);
          alert('Succesfully saved.');
        });

        socket.emit('load-settings');
        break;
      }
      case 'admin/ep_profile_modal_analytics': {
        socket = io.connect(room, {path: `${baseURL}socket.io`, resource});


        socket.on('load-pads-result', (data) => {
          console.log('load-pads', data);
          $.each(data, (index, value) => {
            $('#pads').append(`<option value="${value}">${value}</option>`);
          });
        });
        socket.on('load-analytics-result', (data) => {
          console.log('load-analytics', data);
          $.each(data.pad_users_data, (index, value) => {
            if (value.userId) {
              $('#users').append(`
              <tr style="height: 0;">
                <td>${value.email || value.userId}</td>
                <td>${value.username}</td>
                <td>${value.createDate}</td>
                <td>${value.lastSeenDate}</td>
                <td>${value.verifiedDate || '-'}</td>
                <td>${(value.verified) ? 'Verified' : 'unconfirmed'}</td>
              </tr>
              `);
            }
          });
        });


        $('#pads').on('change', function () {
          socket.emit('load-analytics', {pad: this.value});
        });

        socket.emit('load-pads');
        break;
      }
      default: {
        return [];
      }
    }
  };
  return documentReady;
})();
