import storeage from '../src/index.ts';

const currentDriver = document.getElementById('currentDriver')!;
currentDriver.textContent = storeage.driver() + '';

storeage.ready().then(() => {
  currentDriver.textContent = storeage.driver() + '';
});

// 用于显示结果
function showResult(message) {
  const result = document.getElementById('result')!;
  result.textContent += message + '\n';
}

// 清除结果
function clearResult() {
  document.getElementById('result')!.textContent = '';
}

// 测试 setItem
async function testSetItem() {
  clearResult();
  showResult('Testing setItem...');

  try {
    // 测试不同类型的数据
    const uint8Array = new Uint8Array(3);
    uint8Array[0] = 97;
    uint8Array[1] = 98;
    uint8Array[2] = 99;
    const testData = {
      string: 'Hello World',
      number: 42,
      object: { name: 'Test', value: 100 },
      array: [1, 2, 3],
      boolean: true,
      undefined: undefined,
      null: null,
      arrayBuffer: uint8Array.buffer,
    };

    for (const [key, value] of Object.entries(testData)) {
      await storeage.setItem(key, value);
      if (key === 'arrayBuffer') {
        showResult(
          `✅ Successfully stored ${key}: ${JSON.stringify(new Uint8Array(value as ArrayBuffer))}`
        );
      } else {
        showResult(`✅ Successfully stored ${key}: ${JSON.stringify(value)}`);
      }
    }
  } catch (error) {
    showResult(`❌ Error in setItem: ${error.message}`);
  }
}

// 测试 getItem
async function testGetItem() {
  clearResult();
  showResult('Testing getItem...');

  try {
    const keys = [
      'string',
      'number',
      'object',
      'array',
      'boolean',
      'undefined',
      'null',
      'arrayBuffer',
    ] as const;

    for (const key of keys) {
      const value = await storeage.getItem(key);
      if (key === 'arrayBuffer') {
        showResult(`✅ Retrieved ${key}: ${JSON.stringify(new Uint8Array(value))}`);
      } else {
        showResult(`✅ Retrieved ${key}: ${JSON.stringify(value)}`);
      }
      showResult(`⏰ type: ${typeof value}`);
      showResult('--------------------------------');
    }

    // 测试不存在的键
    const nonExistent = await storeage.getItem('nonexistent');
    showResult(`✅ Non-existent key test: ${nonExistent === null ? 'passed' : 'failed'}`);
  } catch (error) {
    showResult(`❌ Error in getItem: ${error.message}`);
  }
}

// 测试 removeItem
async function testRemoveItem() {
  clearResult();
  showResult('Testing removeItem...');

  try {
    // 先存储一个测试项
    await storeage.setItem('testRemove', 'test value');
    showResult('✅ Added test item');

    // 删除它
    await storeage.removeItem('testRemove');
    showResult('✅ Removed test item');

    // 验证是否已删除
    const value = await storeage.getItem('testRemove');

    console.log(value);
    showResult(
      `✅ Verification: item is ${value === null ? 'successfully removed' : 'still present'}`
    );
  } catch (error) {
    showResult(`❌ Error in removeItem: ${error.message}`);
  }
}

// 测试 clear
async function testClear() {
  clearResult();
  showResult('Testing clear...');

  try {
    // 先添加一些测试数据
    await storeage.setItem('test1', 'value1');
    await storeage.setItem('test2', 'value2');
    showResult('✅ Added test items');

    // 清除所有数据
    await storeage.clear();
    showResult('✅ Cleared all items');

    // 验证是否已清除
    const value1 = await storeage.getItem('test1');
    const value2 = await storeage.getItem('test2');
    showResult(
      // eslint-disable-next-line max-len
      `✅ Verification: items are ${value1 === null && value2 === null ? 'successfully cleared' : 'still present'}`
    );
  } catch (error) {
    showResult(`❌ Error in clear: ${error.message}`);
  }
}

// 添加事件监听器
document.getElementById('setItem')!.addEventListener('click', testSetItem);
document.getElementById('getItem')!.addEventListener('click', testGetItem);
document.getElementById('removeItem')!.addEventListener('click', testRemoveItem);
document.getElementById('clear')!.addEventListener('click', testClear);
