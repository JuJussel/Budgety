<template>
    <div>
        <div class="field">
            <label for="budget"> {{ $t("budget") }} </label>
            <InputNumber v-model="period" inputId="budget" />
        </div>

        <div class="field">
            <label for="showOld"> {{ $t("includePastData") }} </label>
            <InputSwitch inputId="showOld" v-model="showOld" />
        </div>

        <Chart type="line" :data="chartSummary" :options="chartOptions" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            period: 2,
            chartOptions: {
                radius: 0,
            },
            showOld: false,
        };
    },
    methods: {
        buildExpenses(account) {
            let budgets =
                this.$store.getters.viewData.budgets?.filter(
                    (i) => i.account === account._id
                ) || []; //per month
            let expenses =
                this.$store.getters.viewData.cashflow?.filter(
                    (i) => i.account === account._id && i.type === "expense"
                ) || [];
            let expensesArray = Array.from("0".repeat(this.timeline.length));
            console.log(expensesArray);
            expenses.forEach((ex) => {
                if (ex.repeat) {
                    if (ex.endDate !== "") {
                        let endDate =
                            new Date(ex.endDate).getFullYear() +
                            this.$t("yearAppend") +
                            new Date(ex.endDate).getMonth();
                        let endIndex = this.timeline.findIndex(
                            (i) => i === endDate
                        );
                        for (let index = 0; index < endIndex; index++) {
                            expensesArray[index] =
                                parseInt(expensesArray[index]) + ex.amount;
                        }
                    } else {
                        for (
                            let index = 0;
                            index < expensesArray.length;
                            index++
                        ) {
                            expensesArray[index] =
                                parseInt(expensesArray[index]) + ex.amount;
                        }
                    }
                } else {
                    let date =
                        new Date(ex.date).getFullYear() +
                        this.$t("yearAppend") +
                        new Date(ex.date).getMonth();
                    let index = this.timeline.findIndex((i) => i === date);
                    expensesArray[index] =
                        parseInt(expensesArray[index]) + ex.amount;
                }
            });

            return expensesArray;
        },
    },
    computed: {
        timeline() {
            if (this.showOld) {
                // Get todays date
                let today = new Date();
                today.setMonth(today.getMonth() - 1);

                // Build timeline from oldest account entry. Accounts are the first thing created
                let startDate = null;
                let accounts = this.$store.getters.viewData.accounts;
                accounts.forEach((account) => {
                    let firstEntryDate = new Date(account.balance[0].date);
                    if (firstEntryDate < startDate || !startDate) {
                        startDate = firstEntryDate;
                    }
                });

                // Build date array since then to month before today
                var months = [];

                while (startDate < today) {
                    months.push(
                        startDate.getFullYear() +
                            this.$t("yearAppend") +
                            startDate.getMonth()
                    );
                    startDate.setMonth(startDate.getMonth() + 1);
                }
            } else {
                var months = [];
            }

            let monthsCount = 12 * this.period;
            for (let index = 0; index < monthsCount; index++) {
                let today = new Date();
                let item = today.setMonth(today.getMonth() + index);
                item =
                    new Date(item).getFullYear() +
                    this.$t("yearAppend") +
                    new Date(item).getMonth();
                months.push(item);
            }
            return months;
        },

        accounts() {
            let accounts = this.$store.getters.viewData.accounts || [];
            accounts.map((account) => {
                // Better do:
                // Calculate balances from last manual entry
                // then slice the array at the start date of the time axis

                account.projectedBalance = [];

                let accountTimeline = [];
                let lastManualBalanceDate = new Date(
                    account.balance.at(-1).date
                );
                let today = new Date();
                today.setMonth(today.getMonth() - 1);

                while (lastManualBalanceDate < today) {
                    accountTimeline.push(
                        new Date(lastManualBalanceDate).getFullYear() +
                            this.$t("yearAppend") +
                            new Date(lastManualBalanceDate).getMonth()
                    );
                    lastManualBalanceDate.setMonth(
                        lastManualBalanceDate.getMonth() + 1
                    );
                }

                accountTimeline = accountTimeline.concat(this.timeline);

                accountTimeline.forEach((item) => {
                    let manualBalance = true;
                    let accountBalance = account.balance.find((b) => {
                        let date =
                            new Date(b.date).getFullYear() +
                            this.$t("yearAppend") +
                            new Date(b.date).getMonth();
                        return date === item;
                    })?.balance;

                    if (!accountBalance) {
                        if (account.projectedBalance.at(-1)) {
                            accountBalance = account.projectedBalance.at(-1);
                            manualBalance = false;
                        } else {
                            accountBalance = account.balance.at(-1).balance;
                        }
                    }

                    if (!manualBalance) {
                        let income =
                            this.$store.getters.viewData.income.find((i) => {
                                let date =
                                    new Date(i.date).getFullYear() +
                                    this.$t("yearAppend") +
                                    new Date(i.date).getMonth();
                                return date === item || item.repeat;
                            })?.amount || 0;
                        let expenses = 0;

                        accountBalance = accountBalance + income - expenses;
                    }
                    account.projectedBalance.push(accountBalance);
                });

                let startIndex = account.projectedBalance.findIndex(
                    (i) => i === this.timeline[0]
                );
                account.projectedBalance = account.projectedBalance.splice(
                    startIndex,
                    1
                );
                // let expenses = this.buildExpenses(account);
                // let incomes = this.buildIncomes(account).projected;

                // console.log(expenses);
                // console.log(incomes);

                // let lastEntry = account.balance.at(-1);
                // let lastEntryDate =
                //     new Date(lastEntry.date).getFullYear() +
                //     this.$t("yearAppend") +
                //     new Date(lastEntry.date).getMonth();
                // let lastEntryBalance = lastEntry.balance;

                // let monthDiff = this.$monthDiff(
                //     new Date(lastEntryDate),
                //     new Date()
                // );

                // let pastMovements =

                // let startBalance =
                //     lastEntryBalance +
                //     incomes * monthDiff -
                //     expenses * monthDiff;

                // let projectedBalance = [startBalance];

                // this.timeline.forEach((date, index) => {
                //     let balance =
                //         projectedBalance[index] - expenses[index] + incomes;
                //     projectedBalance.push(balance);
                // });
                // account.projectedBalance = projectedBalance;
            });
            // accounts.map(i => {
            //     i.balance = []
            //     this.timeline.array.forEach(date => {
            //         let balance = i.balance +
            //     });
            // });
            return accounts;
        },
        datasets() {
            let datasets = [];
            this.accounts.forEach((account) => {
                datasets.push({
                    label: account.name + " " + account.owner + " projected",
                    backgroundColor: "#42A5F5",
                    data: account.projectedBalance,
                });
            });
            return datasets;
        },
        chartSummary() {
            return {
                labels: this.timeline,
                datasets: this.datasets,
            };
        },
    },
};
</script>