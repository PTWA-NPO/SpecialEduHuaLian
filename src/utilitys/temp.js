let Data = {
    "Unit": "Number",
    "CarryAmount": 2,
    "NumberAmount": 5,
    "CustomeUnit": null,
    "decimalPoint": 2,
    "Preset": {
        "Number": ["149.2", "254.1"],
        "Symbol": "+"
    },
    "Answer": {
        "Carry": [],
        "Answer": "403",
        "Number": ["149", "254"],
        "Symbol": "+"
    },

    // 小數點後位數不夠的補上 " "
    decimalPoint() {
        for (var i in this.Preset.Number) {
            let numArr = this.Preset.Number[i].split(".");
            numArr[1] = numArr[1].padEnd(this.decimalPoint, " ");
        }
        return numArr.join(".");
    }
}

