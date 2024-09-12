import {
  Chart,
  bar,
  line,
} from '@gravityxlab/libs/packages/chart';
import {
  ms,
  format,
} from '@gravityxlab/libs/packages/time';

const search = new URLSearchParams(window.location.search);
const theme = search.get('theme') || 'dark'; // dark or light

const canvas =  document.getElementById('chart');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = theme === 'dark' ? '#151718' : '#FFFFFF';

const chart = new Chart(
  canvas.getContext('2d'),
  {
    theme: {
      text: theme === 'dark' ? '#B7BDC6' : '#030712',
    },
    padding: {
      left: 4,
      right: 4,
    },
    axisRight: {
      range: [0, 12000],
      key: 'socket_count',
      unit: 'Socket'
    },
    axisLeft: {
      width: 28,
      range: [0, 100],
      keys: ['cpu', 'memory'],
      unit: '%',
    },
    axisBottom: {
      height: 16,
      key: 'time',
      interval: 12 * ms('10s'),
      tickIntervalCount: 12,
      label: (value) => format(value, 'HH:mm'),
    },
    config: [
      {
        chart: bar.settings({
          color: '#F6465D'
        }),
        key: 'socket_count',
      },
      {
        chart: line.settings({
          color: '#2DBC85',
          lineWidth: 2,
        }),
        key: 'cpu',
      },
      {
        chart: line.settings({
          lineWidth: 2,
        }),
        key: 'memory',
      }
    ],
  }
);

chart.draw();

document.addEventListener('message', (event) => {
  const payload = event.data;

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'received', originalMessage: payload}));
  }

  if (!payload) {
    return;
  }

  if (payload.data) {
    chart.dataStash.add(payload.data);
  }

  
});