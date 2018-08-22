from __future__ import division
import copy

def calc_average_payment(dict_of_payments):
    sum_of_all = sum(dict_of_payments.values())
    return round(sum_of_all/ len(dict_of_payments), 2)


def calc_overpayment(dict_of_payments, average_payment):
    overpaid_persons = dict()
    for item in dict_of_payments.items():
        if item[1] > average_payment:
            overpaid_persons[item[0]] = round(item[1] - average_payment, 2)

    return overpaid_persons

def calc_debt(dict_of_payments, average_payment):
    debts = dict()
    for person in dict_of_payments.items():
        if -1 * (person[1] - average_payment) < 0:
            dict_of_payments.pop(person[0])
        else:
            debts[person[0]] = round(-1 * (person[1] - average_payment), 2)

    return debts


def calc_percent_of_overpainment(overpaid_persons, average_payment):
    for person in overpaid_persons.items():

        overpaid_persons[person[0]] = person[1] - average_payment

    all_overpayment = sum(overpaid_persons.values())

    for person in overpaid_persons.items():
        overpaid_persons[person[0]] = person[1] / all_overpayment

    return overpaid_persons


def calc_amount_of_payment(debtors, percentage_of_overpayment):
    who_whom = dict()
    for debtor in debtors.items():
        should_return = dict()
        for overpaid in percentage_of_overpayment.items():
            should_return[overpaid[0]] = round(debtor[1] * overpaid[1], 2)

        who_whom[debtor[0]] = should_return

    return who_whom

def calc_debtors(data):
    # how much each should pay?
    result = dict()

    average_payment = calc_average_payment(data)
    result['average_payment'] = round(average_payment, 2)

    # to whom you should pay?
    overpaid_persons = calc_overpayment(data, average_payment)
    result['overpaid_persons'] = overpaid_persons

    percentage_of_overpayment = calc_percent_of_overpainment(overpaid_persons = copy.copy(overpaid_persons),
                                                             average_payment = average_payment)
    result['percentage_of_overpayment'] = percentage_of_overpayment

    debtors = calc_debt(data, average_payment)
    result['debtors'] = debtors

    amount_of_payment = calc_amount_of_payment(debtors=debtors, percentage_of_overpayment=percentage_of_overpayment)
    result['amount_of_payment'] = amount_of_payment

    return result

def prepare_for_calculation(data):
    for item in data.items():
        if item[0] == 'csrfmiddlewaretoken':
            data.pop(item[0])
        else:
            print(item[1])
            data[item[0]] = float(item[1][0])


    return data

#
# dict_of_payments = {
#     'Dima': 0,
#     'Nikita': 576.2,
#     'Oleg': 570,
#     'Boria': 234.5,
#     'Denis': 150
# }
#
# calc_debtors(dict_of_payments)