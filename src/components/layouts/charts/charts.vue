<template>
    <div>
        <Chart type="line" :data="chartSummary" :options="chartOptions"/>

    </div>
</template>

<script>
export default {
    data() {
        return {
            period: 40,
            chartOptions: {
                radius: 0
            }
        }
    },
    methods: {
        buildExpenses(account) {
            let budgets = this.$store.getters.viewData.budgets.data?.filter(i => i.account === account._id) || [] //per month
            let expenses = this.$store.getters.viewData.cashflow.data?.filter(i => i.account === account._id && i.type === 'expense') || []
            let expensesArray = Array.from('0'.repeat(this.timeline.length));
            console.log(expensesArray);
            expenses.forEach(ex => {
                if (ex.repeat) {
                    if (ex.endDate !== "") { 
                        let endDate = new Date(ex.endDate).getFullYear() + this.$t('yearAppend') + new Date(ex.endDate).getMonth()
                        let endIndex = this.timeline.findIndex(i => i === endDate)
                        for (let index = 0; index < endIndex; index++) {
                            expensesArray[index] = parseInt(expensesArray[index]) + ex.amount
                        }
                    } else {
                        for (let index = 0; index < expensesArray.length; index++) {
                            expensesArray[index] = parseInt(expensesArray[index]) + ex.amount
                        }
                    }
                } else {
                    let date = new Date(ex.date).getFullYear() + this.$t('yearAppend') + new Date(ex.date).getMonth()
                    let index = this.timeline.findIndex(i => i === date)
                    expensesArray[index] = parseInt(expensesArray[index]) + ex.amount
                }
            });

            return expensesArray
        },
        buildIncomes(account) {
            let incomes = this.$store.getters.viewData.cashflow.data?.filter(i => i.account === account._id && i.type === 'income') || []
            let retunValue = {
                projected: incomes.reduce((p,c) => p+c.amount, 0),
                actual: null
            }
            return retunValue
        }
    },
    computed: {
        timeline() {
            let monthsCount = 12 * this.period;
            let months = [];
            for (let index = 0; index < monthsCount; index++) {
                let today = new Date()
                let item = today.setMonth(today.getMonth() + index)
                item = new Date(item).getFullYear() + this.$t('yearAppend') + new Date(item).getMonth()
                months.push(item)
            }
            return months
        },
        accounts() {
            let accounts = this.$store.getters.viewData.accounts.data || []
            accounts.map((account) => {
                let expenses = this.buildExpenses(account)
                let incomes = this.buildIncomes(account).projected
                let projectedBalance = [account.balance]
                this.timeline.forEach((date, index) => {
                    let balance = projectedBalance[index] - expenses[index] + incomes
                    projectedBalance.push(balance)
                })
                //Expenses needed
                account.projectedBalance = projectedBalance
            })
            // accounts.map(i => {
            //     i.balance = []
            //     this.timeline.array.forEach(date => {
            //         let balance = i.balance + 
            //     });
            // });
            return accounts
            
        },
        datasets() {
            let datasets = []
            this.accounts.forEach(account => {
                datasets.push({
                    label: account.name + ' ' + account.owner + ' projected',
                    backgroundColor: '#42A5F5',
                    data: account.projectedBalance
                })
            })
            return datasets
        },
        chartSummary() {
            return {
                labels: this.timeline,
                datasets: this.datasets,
			}
        }
    }
}
</script>