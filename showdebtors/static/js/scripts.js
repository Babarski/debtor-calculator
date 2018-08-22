$(document).ready(function (){
    var debtors_input_id = 0

    function add_form_group(){

        var debtor_tr = document.createElement("tr");
        var debtor_name_td = document.createElement("td");
        var debtor_payment_td = document.createElement("td");
        var debtor_delete = document.createElement("td");

        var debtor_delete_button = document.createElement("button");
        debtor_delete_button.setAttribute('id', 'delete_'+debtors_input_id);
        debtor_delete_button.setAttribute('type', 'button');
        debtor_delete_button.setAttribute('class', 'btn btn-danger remove-debtor');
        debtor_delete_button.innerHTML = 'Delete'

        var debtop_input_name = document.createElement("input");
        debtop_input_name.setAttribute('type', 'text');
        debtop_input_name.setAttribute('id', 'name_'+debtors_input_id);
        debtop_input_name.setAttribute('class', 'input_name');

        var debtop_input_payment = document.createElement("input");
        debtop_input_payment.setAttribute('type', 'number');
        debtop_input_payment.setAttribute('id', 'payment_'+debtors_input_id);
        debtop_input_payment.setAttribute('class', 'input_payment');
        debtop_input_payment.setAttribute('value', '0');
        debtop_input_payment.setAttribute('step', '0.01');
        debtop_input_payment.setAttribute('min', '0');

        debtor_name_td.appendChild(debtop_input_name)
        debtor_payment_td.appendChild(debtop_input_payment)
        debtor_delete.appendChild(debtor_delete_button)

        debtor_tr.appendChild(debtor_name_td)
        debtor_tr.appendChild(debtor_payment_td)
        debtor_tr.appendChild(debtor_delete)

        debtors_input_id += 1

        $('#debtors_table').append(debtor_tr);

    }

    function show_debtors_form(){

        for ( var i = 0; i<2; i++){
            add_form_group()
        }

    }

    function show_debtors_data(data){
        $('.data-info').empty();
        console.log(data)
        var average_payment = document.createElement('p')
        average_payment.innerHTML = 'Average payment: '+data['average_payment']

        var overpaid_persons = document.createElement('ul')
        overpaid_persons.setAttribute('class', 'data-ul-info');
        overpaid_persons.setAttribute('class', 'list-inline');
        $.each(data['overpaid_persons'], function(index, value){
            var overpaid_person = document.createElement('li');
            overpaid_person.setAttribute('class', 'list-inline-item');
            overpaid_person.setAttribute('class', 'col-xs-6');
            overpaid_person.innerHTML = index+' - '+value;
            overpaid_persons.appendChild(overpaid_person)
        })

        var debtors = document.createElement('ul')
        debtors.setAttribute('class', 'data-ul-info');
        debtors.setAttribute('class', 'list-inline');
        $.each(data['debtors'], function(index, value){
            if (value > 0){
                var debtor = document.createElement('li');
                debtor.setAttribute('class', 'list-inline-item');
                debtor.setAttribute('class', 'col-xs-3');
                debtor.innerHTML = index+' - '+value
                debtors.appendChild(debtor)
            }
        })

        $('.data-info').append(average_payment)
        $('.data-info').append('<p class="list-label">Overpaid</p>')
        $('.data-info').append(overpaid_persons)
        $('.data-info').append('<p class="list-label">Debtors</p>')
        $('.data-info').append(debtors)

        var debtors_payment_table = document.createElement('table');
        debtors_payment_table.setAttribute('class', 'table')
        debtors_payment_table.setAttribute('id', 'show_debtors')

        $('.data-info').append(debtors_payment_table)

        var debtors_payment_table_head = document.createElement('tr');
        var debtors_payment_table_head_columns = '<th>Debtor</th>';

        $.each(data['overpaid_persons'], function(index, value){
            debtors_payment_table_head_columns += '<th>Owe to '+index+'</th>'
        })

        debtors_payment_table_head.innerHTML = debtors_payment_table_head_columns;
        debtors_payment_table.append(debtors_payment_table_head);

        $.each(data['amount_of_payment'], function(index, value){
            var debtor_row = document.createElement('tr');

            var debtor_payment = '<td>'+index+'</td>'
            $.each(value, function(index, value){
                debtor_payment += '<td>'+value+'</td>'
            })

            debtor_row.innerHTML = debtor_payment;
            $('#show_debtors').append(debtor_row);
        })

    }


    function check_input_data(){
        var arr_of_input_names = []
        var res = true;
        $('.input_name').each(function(){
            if ($.inArray($(this).val(), arr_of_input_names) !== -1)
            {
                alert("Duplicate names \n Please change for correct calculation");
                res = false;
            }
            else {
                arr_of_input_names.push($(this).val());
            }
        })
        return res;
    }

    $('#add_another').on('click', function(e){
        e.preventDefault();
        add_form_group();
    })

    $('#submit_btn').on('click', function(e){
        e.preventDefault();

        if (check_input_data()) {
            data = {}
            $('.input_name').each(function(){

                var input_name_id = $(this).attr('id');
                var input_payment_id = 'payment_'+input_name_id.split('_')[1]

                data[$('#'+input_name_id).val()] = $('#'+input_payment_id).val()
            })

            var csrf_token = $('#csrf_toker_div [name="csrfmiddlewaretoken"]').val();
            data["csrfmiddlewaretoken"] = csrf_token;

            var form = $('#payment_form');
            var url = form.attr("action");

            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                cache: true,
                success: function (data) {
                    console.log("OK");
                    show_debtors_data(data);
                },
                error: function(){
                    console.log("error");
                }
            })
        }

    })



    $(document).on('click', '.remove-debtor', function(event){
        event.preventDefault();
        console.log($('#debtors_table td').length);
        if ($('#debtors_table td').length > 6){
             var id_to_delete = $(this).attr('id').split('_')[1]
             $( '#name_'+id_to_delete ).parent().parent().remove();
        }
        else {
            alert("You can't delete this \n Too few people");
        }


    })

    show_debtors_form();


})