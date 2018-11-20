export class Participant {
    constructor(firstname, lastname, group) {
        this.Firstname = firstname;
        this.Lastname = lastname;
        this.Group = String(group);
    }

    get Name() {
        return (this.Firstname + " " + this.Lastname);
    }
}