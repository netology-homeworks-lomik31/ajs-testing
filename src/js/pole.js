function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

export class Pole {
    constructor(el) {
        this.el = el;
        this.pole_ids = [];
        this.krot_id = -1;
        this.losses = 0;
        for (let item of this.el.querySelectorAll(".line__item")) {
            this.pole_ids.push(item.id);
            item.addEventListener("click", () => {
                this.click(item.id);
            });
        }
    }
    setNextKrot() {
        let el;
        if (this.krot_id !== -1) {
            el = this.el.querySelector("#" + this.krot_id);
            el.classList.remove("krot");
            if (!el.classList.contains("clicked")) {
                this.losses++;
            }
            if (this.losses === 5) {
                alert("Вы проиграли!");
                this.losses = 0;
                return;
            }
        }
        let i = 0;
        do {
            this.krot_id =
                this.pole_ids[randomInteger(0, this.pole_ids.length - 1)];
            i++;
        } while (el !== undefined && this.krot_id === el.id && i < 5);
        el = this.el.querySelector("#" + this.krot_id);
        el.classList.add("krot");
    }
    click(id) {
        if (this.krot_id === id) {
            this.el.querySelector("#" + id).classList.add("clicked");
        }
    }
}
