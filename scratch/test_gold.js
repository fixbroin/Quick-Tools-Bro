const testApi = async () => {
  try {
    const res = await fetch('https://goldratetodaylive.in/api/v1/rates/today.json');
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
};
testApi();
