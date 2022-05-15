import provinces from './provinces.json';
import cities from './cities.json';
import areas from './areas.json';

// getMapOptions 返回antd 级联选择中的数据，这里的value都是字符串
function getMapOptions() {
  areas.forEach((area, id) => {
    const matchCity = cities.filter((city) => city.code === area.cityCode)[0];
    if (matchCity) {
      matchCity.children = matchCity.children || [];
      matchCity.children.push({
        label: area.name,
        value: area.name,
        key: area.code,
      });
    }
  });
  cities.forEach((city, id) => {
    const matchProvince = provinces.filter((province) => province.code === city.provinceCode)[0];
    if (matchProvince) {
      matchProvince.children = matchProvince.children || [];
      matchProvince.children.push({
        label: city.name,
        value: city.name,
        key: city.code,
        children: city.children,
      });
    }
  });
  return provinces.map((province, id) => ({
    label: province.name,
    value: province.name,
    key: province.code,
    children: province.children,
  }));
}
const MapOptions = getMapOptions();
export { MapOptions };
