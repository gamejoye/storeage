import storeage from '../src/index.ts';

const currentDriver = document.getElementById('currentDriver')!;
currentDriver.textContent = storeage.driver() + '';

(async () => {
  await storeage
    .iterate((key, value, index) => {
      console.log('=> ', index, key, value);
    })
    .then(result => {
      console.log('done', result);
      console.log('--------------------------------');
      console.log('--------------------------------');
    });

  storeage.iterate(
    (key, value, index) => {
      console.log('=> ', index, key, value);
      if (index === 3) {
        return [key, value];
      }
    },
    result => {
      console.log('done', result);
      console.log('--------------------------------');
      console.log('--------------------------------');
    }
  );
})();

storeage.ready().then(() => {
  currentDriver.textContent = storeage.driver() + '';
  storeage.length().then(length => {
    document.getElementById('length')!.textContent = length + '';
  });
  storeage.keys().then(keys => {
    document.getElementById('keys')!.textContent = keys.join(', ');
  });
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

function testDropInstance() {
  storeage.dropInstance().then(() => {
    clearResult();
    showResult('✅ Successfully dropped testStore');
  });
}

// 测试 setItem
async function testSetItem() {
  clearResult();
  showResult('Testing setItem...');

  try {
    // 测试不同类型的数据
    const float32Array = new Float32Array([-123.456, 0, 123.456]);
    const float64Array = new Float64Array([-123456.789, 0, 123456.789]);
    const int8Array = new Int8Array([-123, 0, 123]);
    const int16Array = new Int16Array([-1000, 0, 1000]);
    const int32Array = new Int32Array([-1000000, 0, 1000000]);
    const uint8Array = new Uint8Array([97, 98, 99]);
    const uint8ClampedArray = new Uint8ClampedArray([0, 128, 255, 300]);
    const uint16Array = new Uint16Array([0, 32768, 65535]);
    const uint32Array = new Uint32Array([0, 2147483648, 4294967295]);
    const testData = {
      string: 'Hello World',
      number: 42,
      object: { name: 'Test', value: 100 },
      array: [1, 2, 3],
      boolean: true,
      undefined: undefined,
      null: null,
      arrayBuffer: uint8Array.buffer,
      float32Array: float32Array,
      float64Array: float64Array,
      int8Array: int8Array,
      int16Array: int16Array,
      int32Array: int32Array,
      uint8Array: uint8Array,
      uint8ClampedArray: uint8ClampedArray,
      uint16Array: uint16Array,
      uint32Array: uint32Array,
    };

    for (const [key, value] of Object.entries(testData)) {
      await storeage.setItem(key, value);
      if (key === 'arrayBuffer') {
        showResult(
          // eslint-disable-next-line max-len
          `✅ Successfully stored ${key}: ${JSON.stringify(Array.from(new Uint8Array(value as ArrayBuffer)))}`
        );
      } else if (
        [
          'float32Array',
          'float64Array',
          'int8Array',
          'int16Array',
          'int32Array',
          'uint8Array',
          'uint8ClampedArray',
          'uint16Array',
          'uint32Array',
        ].includes(key)
      ) {
        showResult(`✅ Successfully stored ${key}: ${JSON.stringify(Array.from(value as any))}`);
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
      'float32Array',
      'float64Array',
      'int8Array',
      'int16Array',
      'int32Array',
      'uint8Array',
      'uint8ClampedArray',
      'uint16Array',
      'uint32Array',
    ] as const;

    for (const key of keys) {
      const value = await storeage.getItem<any>(key);
      if (value === null) {
        showResult(`✅ Retrieved ${key}: ${JSON.stringify(value)}`);
      } else if (key === 'arrayBuffer') {
        showResult(`✅ Retrieved ${key}: ${JSON.stringify(Array.from(new Uint8Array(value)))}`);
      } else if (
        [
          'float32Array',
          'float64Array',
          'int8Array',
          'int16Array',
          'int32Array',
          'uint8Array',
          'uint8ClampedArray',
          'uint16Array',
          'uint32Array',
        ].includes(key)
      ) {
        showResult(`✅ Retrieved ${key}: ${JSON.stringify(Array.from(value))}`);
      } else {
        showResult(`✅ Retrieved ${key}: ${JSON.stringify(value)}`);
      }
      showResult(`⏰ type: ${Object.prototype.toString.call(value)}`);
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
document.getElementById('dropInstance')!.addEventListener('click', testDropInstance);
