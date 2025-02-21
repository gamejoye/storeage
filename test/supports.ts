import storeage from '../src/index.ts';
import { INTERNAL_DRIVERS } from '../src/constants';

interface DriverInfo {
  name: string;
  id: string;
}

const drivers: DriverInfo[] = [
  { name: 'IndexedDB', id: INTERNAL_DRIVERS.IDB },
  { name: 'LocalStorage', id: INTERNAL_DRIVERS.LOCALSTORAGE },
  { name: 'WebSQL', id: 'websql' },
];

// 检查驱动程序支持状态
function checkDriverSupport() {
  const driverList = document.getElementById('driverList')!;
  driverList.innerHTML = '';

  drivers.forEach(driver => {
    const isSupported = storeage.supports(driver.id);

    const driverElement = document.createElement('div');
    driverElement.className = 'driver-status';

    driverElement.innerHTML = `
      <span class="driver-name">${driver.name}</span>
      <span class="status ${isSupported ? 'supported' : 'not-supported'}">
        ${isSupported ? '✓ Supported' : '✗ Not Supported'}
      </span>
    `;

    driverList.appendChild(driverElement);
  });
}

async function showCurrentDriver() {
  storeage.config({
    driver: [INTERNAL_DRIVERS.IDB],
  });
  const currentDriverElement = document.getElementById('currentDriver')!;
  const currentDriver = await storeage.ready().then(() => storeage.driver());

  currentDriverElement.innerHTML = `
    <div class="driver-status">
      <span class="driver-name">Active Driver:</span>
      <span class="status supported">${currentDriver}</span>
    </div>
  `;
}

function initTest() {
  try {
    checkDriverSupport();
    showCurrentDriver();
  } catch (error) {
    const errorElement = document.getElementById('error')!;
    errorElement.textContent = `Error: ${error.message}`;
  }
}

initTest();
