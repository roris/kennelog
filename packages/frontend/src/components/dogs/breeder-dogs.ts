import { bindable } from "aurelia-framework";


export class BreederDogs {
    @bindable user;
    @bindable dogs;
    @bindable breeds;

    constructor() {
        this.user = {
            name: "M.T. Ahmed",
            avatar: "https://avatars1.githubusercontent.com/u/3112235?s=460&v=4"
        }

        this.breeds = [
            "German Shepherd",
            "Retreiver"
        ];

        this.dogs = [
            {
                id: 11112,
                name: "Agood Dog",
                breed: "German Shepherd",
                gender: "M",
                microchipNo: "123123123123123",
                avatar: "https://avatars1.githubusercontent.com/u/24278269?s=88&v=4"
            },
            {
                id: 11113,
                name: "Another Dog",
                breed: "German Shepherd",
                gender: "F",
                microchipNo: "456456456456456",
                avatar: "https://avatars1.githubusercontent.com/u/24278269?s=88&v=4"
            }
        ]
    }
}