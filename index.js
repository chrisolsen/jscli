const puts = console.log;

function putsb(err) {
    const div = "*".repeat(err.length);
    console.log(div);
    console.log(err);
    console.log(div + "\n");
}

class Menu {
    constructor(name, items = []) {
        this.name = name;
        this.items = items;

        const item = items[0];
        if (!this.validItem(item)) {
            throw "Invalid menu item";
        }
    }

    get(key) {
        return this.items.find(item => {
            return item.key == key;
        });
    }

    addStart(item) {
        if (!this.validItem(item)) {
            throw "Invalid menu item";
        }
        this.items = [item].concat(this.items);
    }

    addEnd(item) {
        if (!this.validItem(item)) {
            throw "Invalid menu item";
        }
        this.items.push(item);
    }

    validItem(item) {
        return item && item.title && item.key && item.action;
    }
}

/**
 * 
 * @param {Menu} menu 
 */
module.exports = {
    puts,
    putsb,
    Menu,
    init: function(menu) {
        bindMenu(menu);
        showMenu(menu);
    }
};


function bindMenu(menu) {
    process.stdin.on('data', input => {
        handleMenuOption(input, menu);
    });
}


function unBindMenu() {
    process.stdin.removeAllListeners('data');
}


/**
 * 
 * @param {*} input 
 * @param {*} getMenuItemFunc function that accepts a string argument to return the corresponding menu item
 */
function handleMenuOption(input, menu) {
    input = input.toString('utf8').trim();
    const args = input.split(" ");
    const menuItem = menu.get(args[0]);
    if (!menuItem) {
        puts("Invalid menu item");
        showMenu(menu);
        return;
    }
    unBindMenu();
    menuItem
        .action(...args)
        .then(() => { bindMenu(menu);})
        .then(() => { showMenu(menu); })
        .catch((ex) => {
            puts(ex);
            bindMenu(menu);
            showMenu(menu);
        });
}


function showMenu(menu) {
    const bar = '-'.repeat(menu.name.length + 6);
    puts('\n');
    puts(bar);
    puts(`-- ${menu.name.toUpperCase()} --`);
    puts(bar);
    menu.items.forEach(item => {
        const str = `${item.key}: ${item.title}`;
        puts(str);
    });
    puts(bar);
    process.stdout.write("\nCommand: ");
}
