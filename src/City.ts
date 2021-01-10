type CityName = "Masadora";

export interface City {
  name: CityName;
  description: string;
}

export const citiesByName: { [name in CityName]: City } = {
  Masadora: {
    name: "Masadora",
    description: "Magic City",
  },
};
