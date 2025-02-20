import storeage from '../src/index.ts';

// 创建第一个实例，属于数据库 "testDB1"
const instance1 = storeage.createInstance({
  name: 'testDB1',
  storeName: 'store1',
  driver: ['idb'],
});

// 创建第二个实例，属于同一个数据库 "testDB1"
const instance2 = storeage.createInstance({
  name: 'testDB1',
  storeName: 'store2',
  driver: ['idb'],
});
instance2.ready();

// 创建第三个实例，属于不同的数据库 "testDB2"
const instance3 = storeage.createInstance({
  name: 'testDB2',
  storeName: 'store1',
  driver: ['idb'],
});

// 配置主实例，属于数据库 "main"
storeage.config({
  name: 'main',
  storeName: 'store1',
  driver: ['idb'],
});

// 测试存储和检索数据
storeage
  .ready()
  .then(() => {
    document.getElementById('main-instance')!.textContent = 'main instance ready';
    document.getElementById('runMainTest')!.addEventListener('click', () => {
      dropInstanceWithLoading('runMainTest', storeage, 'main-instance-drop-status');
    });
  })
  .catch(error => {
    document.getElementById('error')!.textContent += `Error: ${error.message}\n`;
  });
instance1
  .ready()
  .then(() => {
    document.getElementById('instance1')!.textContent = 'instance1 ready';
    document.getElementById('runInstance1Test')!.addEventListener('click', () => {
      dropInstanceWithLoading('runInstance1Test', instance1, 'instance1-drop-status');
    });
  })
  .catch(error => {
    document.getElementById('error')!.textContent += `Error: ${error.message}\n`;
  });
instance2
  .ready()
  .then(() => {
    document.getElementById('instance2')!.textContent = 'instance2 ready';
    document.getElementById('runInstance2Test')!.addEventListener('click', () => {
      dropInstanceWithLoading('runInstance2Test', instance2, 'instance2-drop-status');
    });
  })
  .catch(error => {
    document.getElementById('error')!.textContent += `Error: ${error.message}\n`;
  });
instance3
  .ready()
  .then(() => {
    document.getElementById('instance3')!.textContent = 'instance3 ready';
    document.getElementById('runInstance3Test')!.addEventListener('click', () => {
      dropInstanceWithLoading('runInstance3Test', instance3, 'instance3-drop-status');
    });
  })
  .catch(error => {
    document.getElementById('error')!.textContent += `Error: ${error.message}\n`;
  });

async function dropInstanceWithLoading(buttonId: string, instance: any, resultId: string) {
  const button = document.getElementById(buttonId) as HTMLButtonElement;
  const result = document.getElementById(resultId) as HTMLSpanElement;

  button.disabled = true;
  result.textContent = 'Loading...';

  try {
    await instance.dropInstance();
    result.textContent = '✅ Successfully dropped instance';
  } catch (error) {
    result.textContent = `❌ Error: ${error.message}`;
  } finally {
    button.disabled = false;
  }
}
