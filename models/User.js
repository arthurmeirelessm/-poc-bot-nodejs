class User {
    constructor(name, age, birthdate, gender, cpf, cep) {
        this.name = name;
        this.age = age;
        this.birthdate = birthdate;
        this.gender = gender;
        this.cpf = cpf;
        this.cep = cep;
    }
}

module.exports.User = User;
