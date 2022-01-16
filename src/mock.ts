import faker, { fake } from 'faker';
import one from './imgs/1.jpeg';
import two from './imgs/2.jpeg';
import three from './imgs/3.jpeg';
import four from './imgs/4.jpeg';
import five from './imgs/5.jpeg';

const images = {
  0: one,
  1: two,
  2: three,
  3: four,
  4: five
}

const GENERATE_COUNT = 20;

export type Item_Type = {
  name: string;
  comment: string;
  pic: string;
  pic2: string;
  thumbUp: number;
  width: number;
  height: number;
  scrollY?: number;
  index?: number;
};

function randomPic() {
  const index = Math.floor(Math.random() * 5);
  return (images as any)[index];
}

export function generateItems(): Item_Type[] {
  const list = [];
  for (let i = 0; i < GENERATE_COUNT; i++) {
    const item = {
      name: fake('{{name.lastName}} {{name.firstName}}, {{name.suffix}}'),
      comment: faker.lorem.text(),
      pic: randomPic(),
      pic2: randomPic(),
      width: 300,
      height: 100,
      thumbUp: faker.datatype.number(),
    };
    list.push(item);
  }
  return list;
}

export function generateDynamicItems(): Item_Type[] {
  const list = [];
  for (let i = 0; i < GENERATE_COUNT; i++) {
    const item = {
      name: fake('{{name.lastName}} {{name.firstName}}, {{name.suffix}}'),
      comment: faker.lorem.text(),
      pic: randomPic(),
      pic2: randomPic(),
      width: Math.random() * 300,
      height: Math.random() * 200,
      thumbUp: faker.datatype.number(),
    };
    list.push(item);
  }
  return list;
}
