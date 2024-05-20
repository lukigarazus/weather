import { Service } from "./base";
import { WeatherService } from "./weather.service";

const services = [WeatherService] satisfies Service[];

export default services;
