import faker, { fake } from 'faker';

const GENERATE_COUNT = 20;

export type Item_Type = {
  name: string;
  comment: string;
  pic: string;
  pic2: string;
  thumbUp: number;
  scrollY?: number;
  index?: number;
};

export function generateItems(): Item_Type[] {
  const list = [];
  for (let i = 0; i < GENERATE_COUNT; i++) {
    const item = {
      name: fake('{{name.lastName}} {{name.firstName}}, {{name.suffix}}'),
      comment: faker.lorem.text(),
      pic: faker.image.dataUri(300, 100),
      pic2: faker.image.dataUri(300, 100),
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
      pic: faker.image.dataUri(Math.random() * 300, Math.random() * 100),
      pic2: faker.image.dataUri(Math.random() * 300, Math.random() * 100),
      thumbUp: faker.datatype.number(),
    };
    list.push(item);
  }
  return list;
}
