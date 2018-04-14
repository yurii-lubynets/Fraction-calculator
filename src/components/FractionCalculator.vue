<template>
    <div class="container">
        <form>
            <span v-for="(fraction, index) in fractions" :key="index">
                <select 
                    v-if="index" 
                    v-validate="{ required: true }"
                    :name = "$_getInputName(index, 'select')"
                    v-model="operators[index-1]" 
                    @click="$_valid" >
                    <option 
                        v-for="(option, id) in options" 
                        :key="id" 
                        :value="option.value">{{ option.text }}</option>
                </select>
                <div class="fraction">
                    <input 
                        v-validate="{ required: true, regex: numeratorRegex }"
                        :name = "$_getInputName(index, 'numerator')"
                        type="text" 
                        v-model="fraction.numerator" 
                        @keyup="$_valid"/>
                    <hr>
                    <input 
                        v-validate="{ required: true, regex: denominatorRegex }"
                        :name = "$_getInputName(index, 'denominator')"
                        type="text"
                        v-model="fraction.denominator"
                        @keyup="$_valid"/>
                </div>
            </span>
        </form>
        <span>=</span>
        <div class="fraction">
            <input type="text" readonly :value="result.numerator" />
            <hr>
            <input type="text" readonly :value="result.denominator" />
        </div>
        <div class="addNew">
            <a @click="$_addFraction">add fraction</a>
        </div>
        <ul class="container-error" v-if="errors && errors.items">
            <li v-for="(error, id) in errors.items" :key="id">{{ error.msg }}</li>
        </ul>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VeeValidate from 'vee-validate';

    Vue.use(VeeValidate);

    class Fraction {
        constructor(numerator, denominator) {
            this.numerator = numerator;
            this.denominator = denominator;
        }
        add(arg) {
            return new Fraction(
                this.numerator * arg.denominator + arg.numerator * this.denominator, 
                this.denominator * arg.denominator);
        }
        subtract(arg) {
            return new Fraction(
                this.numerator * arg.denominator - arg.numerator * this.denominator,
                this.denominator * arg.denominator);
        }
        multiply(arg) {
            return new Fraction(
                this.numerator * arg.numerator,
                this.denominator * arg.denominator);
        }
        divide(arg) {
            return new Fraction(
                this.numerator * arg.denominator,
                this.denominator * arg.numerator);
        }
        simplify() {
            if (this.numerator < 0 && this.denominator < 0) {
                this.numerator = Math.abs(this.numerator);
                this.denominator = Math.abs(this.denominator);
            }
            let commonDivisor = gcd(this.numerator, this.denominator);
            this.numerator /= commonDivisor;
            this.denominator /= commonDivisor;
        }
    }
    const gcd = (a, b) => {
        if ( !b ) {
            return a;
        }
        return gcd(b, a % b);
    }

    export default {
        name: 'FractionCalculator',
        data () {   
            return {
                numeratorRegex: /^[-+]?[0-9]\d*$/,
                denominatorRegex: /^[-+]?[1-9]\d*$/,
                options: [
                    {
                        value: '+',
                        text: '+'
                    },
                    {
                        value: '-',
                        text: '-'
                    },
                    {
                        value: '*',
                        text: '*'
                    },
                    {
                        value: '/',
                        text: '/'
                    }
                ],
                fractions: [],
                operators: [],
                result: new Fraction
            }
        },
        mounted () {
            this.$_init();
        },
        computed: {
            formValid: {
                get: function() {
                    return Object.keys(this.fields).every(key => {
                        return this.fields[key] && this.fields[key].valid && this.fields[key].validated;
                    });
                }
            }
        },
        watch: {
            formValid(valid) {
                valid ? this.$_calc() : null;
            }
        },
        methods: {
            $_init: function() {
                this.$_addFraction();
                this.$_addFraction();
            },
            $_addFraction: function() {
                let fraction = new Fraction;
                this.fractions.push(fraction);
            },
            $_calc: function() {
                console.log("--");
                let fractionsItem = this.fractions.slice(),
                    operatorsItem = this.operators.slice();

                try {
                    loop:
                        for (var i = 0; i < operatorsItem.length; i++) {
                            switch (operatorsItem[i]) {
                                case '*':
                                    fractionsItem[i] = fractionsItem[i].multiply(fractionsItem[i + 1]);
                                    break;
                                case '/':
                                    fractionsItem[i] = fractionsItem[i].divide(fractionsItem[i + 1]);
                                    break;
                                default:
                                    continue loop;
                            }
                            operatorsItem.splice(i, 1);
                            fractionsItem.splice(i + 1, 1);
                            i--;
                        }
                    loop:
                        for (var i = 0; i < operatorsItem.length; i++) {
                            switch (operatorsItem[i]) {
                                case '+':
                                    fractionsItem[i] = fractionsItem[i].add(fractionsItem[i + 1]);
                                    break;
                                case '-':
                                    fractionsItem[i] = fractionsItem[i].subtract(fractionsItem[i + 1]);
                                    break;
                                default:
                                    throw "Not correct operation: " + operatorsItem[i];
                            }
                            operatorsItem.splice(i, 1);
                            fractionsItem.splice(i + 1, 1);
                            i--;
                        }
                    fractionsItem[0].simplify();
                    this.result = new Fraction(fractionsItem[0].numerator, fractionsItem[0].denominator);
                } catch (e) {
                    console.log(e);
                }

                return false;
            },
            $_valid: function() {
                this.formValid && !this.errors.any() ? this.$_calc() : null;
            },
            $_getInputName: function(index, dataName) {
                return "fraction-" + ++index +" " + dataName;
            }    
        }
    }
</script>

<style lang="less" scoped>
    .container {
        display: block;
        margin: 10% auto;
        padding: 20px;
        border: 1px solid #ccc;
        background: #eee;
        &-error {
            display: inline-block;
            list-style-type: none;
            text-align: left;
            padding: 0;
            font-size: 12px;
            li {
                padding: 2px 0;
            }
        }
    }
    form {
        display: inline-block;
    }
    .fraction {
        display: inline-block;
        vertical-align: middle;
        margin: 0 10px;
        input {
            border: 0;
            width: 5em;
            text-align: center;
        }
    }
    .addNew {
        margin: 20px;
        cursor: pointer;
        a {
            text-transform: uppercase;
            text-decoration: underline;
        }
    }
</style>
