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

        <div style="height: 500px">
            <Chart
                :data="chartSummary"
                :options="chartOptions"
                style="height: 100%"
            />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            period: 2,
            lineColors: [
                '#3f51b5',
                '#607d8b',
                '#9c27b0'
            ],
            chartOptions: {
                maintainAspectRatio: false,
                responsive: true,
                radius: 0,
                interaction: {
                    intersect: false,
                    mode: "index",
                },
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
                let today = this.$dayjs();
                //today.setMonth(today.getMonth() - 1);

                // Build timeline from oldest account entry. Accounts are the first thing created
                let startDate = null;
                let accounts = this.$store.getters.viewData.accounts;
                accounts.forEach((account) => {
                    let firstEntryDate = this.$dayjs(account.balance[0].date);
                    if (firstEntryDate < startDate || !startDate) {
                        startDate = firstEntryDate;
                    }
                });

                // Build date array since then to month before today
                var months = [];

                while (startDate < today) {
                    months.push(this.$dayjs(startDate).format("YYYY/MM"));
                    startDate = this.$dayjs(startDate).add(1, "month");
                }
            } else {
                var months = [];
            }

            let monthsCount = 12 * this.period;
            for (let index = 0; index < monthsCount; index++) {
                let item = this.$dayjs().add(index, "month");
                months.push(this.$dayjs(item).format("YYYY/MM"));
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
                let lastManualBalanceDate = this.$dayjs(
                    account.balance.at(-1).date
                );
                let today = this.$dayjs().subtract(1, "month");

                while (lastManualBalanceDate < today) {
                    accountTimeline.push(lastManualBalanceDate);
                    lastManualBalanceDate = this.$dayjs(
                        lastManualBalanceDate
                    ).add(1, "month");
                }

                accountTimeline = accountTimeline.concat(this.timeline);

                accountTimeline.forEach((timeLineDate) => {
                    let manualBalance = true;
                    let accountBalance = account.balance.find((b) => {
                        let date = this.$dayjs(b.date);
                        return this.$dayjs(date).isSame(timeLineDate, "month");
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
                        let incomeAccu = 0;
                        this.$store.getters.viewData.income.forEach(
                            (income) => {
                                if (income.account !== account._id) return;
                                if (
                                    this.$dayjs(income.date).isAfter(
                                        timeLineDate,
                                        "month"
                                    )
                                ) {
                                    return;
                                }
                                if (
                                    this.$dayjs(income.date).isSame(
                                        timeLineDate,
                                        "month"
                                    )
                                ) {
                                    incomeAccu = incomeAccu + income.amount;
                                    return;
                                }
                                if (income.repeat && !income.endDate) {
                                    incomeAccu = incomeAccu + income.amount;
                                    return;
                                }
                                if (
                                    income.repeat &&
                                    this.$dayjs(income.endDate).isSameOrAfter(
                                        timeLineDate,
                                        "month"
                                    )
                                ) {
                                    incomeAccu = incomeAccu + income.amount;
                                }
                            }
                        );

                        let expensesAccu = 0;
                        this.$store.getters.viewData.expenses.forEach(
                            (expense) => {
                                if (expense.account !== account._id) return;
                                if (
                                    this.$dayjs(expense.date).isAfter(
                                        timeLineDate,
                                        "month"
                                    )
                                ) {
                                    return;
                                }
                                if (
                                    this.$dayjs(expense.date).isSame(
                                        timeLineDate,
                                        "month"
                                    )
                                ) {
                                    expensesAccu =
                                        expensesAccu + expense.amount;
                                    return;
                                }
                                if (expense.repeat && !expense.endDate) {
                                    expensesAccu =
                                        expensesAccu + expense.amount;
                                    return;
                                }
                                if (
                                    expense.repeat &&
                                    this.$dayjs(expense.endDate).isAfter(
                                        timeLineDate,
                                        "month"
                                    )
                                ) {
                                    expensesAccu =
                                        expensesAccu + expense.amount;
                                }
                            }
                        );

                        // Loan Expenses

                        let loanExpenses = 0;
                        this.$store.getters.viewData.loans.forEach((loan) => {
                            if (loan.account !== account._id) return;
                            let thisMonthsPayment = loan.payments.filter(
                                (payment) =>
                                    this.$dayjs(payment.date).isSame(
                                        timeLineDate,
                                        "month"
                                    )
                            );
                            if (thisMonthsPayment.length < 1) return;

                            thisMonthsPayment = thisMonthsPayment.reduce(
                                (accum, currnet) => accum + currnet.payment,
                                0
                            );
                            loanExpenses = Number(
                                loanExpenses + thisMonthsPayment
                            );
                        });
                        // console.log(incomeAccu);
                        // console.log(expensesAccu);
                        // console.log(loanExpenses);
                        accountBalance =
                            accountBalance +
                            incomeAccu -
                            expensesAccu -
                            loanExpenses;
                    }
                    account.projectedBalance.push(accountBalance);
                });
                let timeLineLength = this.timeline.length;
                account.projectedBalance = account.projectedBalance.slice(
                    -timeLineLength
                );
            });
            return accounts;
        },
        accumulated() {
            let accumulated = null
            this.accounts.forEach((account) => {
                if (!accumulated) {
                    accumulated = JSON.parse(JSON.stringify(account.projectedBalance))
                    return
                }
                account.projectedBalance.forEach((balance, index) => {
                    accumulated[index] = accumulated[index] + balance
                })
            })
            return accumulated
        },
        datasets() {
            let datasets = [];
            this.accounts.forEach((account, index) => {
                datasets.push({
                    type: "line",
                    label: account.name + " " + account.owner + " projected",
                    backgroundColor: this.lineColors[index] || '#009688' ,
                    borderColor: this.lineColors[index] || '#009688' ,
                    data: account.projectedBalance,
                });
            });
            datasets.push({
                    type: "bar",
                    label: this.$t('accumulated'),
                    backgroundColor: "#ede7f6",
                    data: this.accumulated,
  
            })
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