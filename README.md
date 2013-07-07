ediTable
========

This javascript library adds basic RUD(Read, Update and delete) to your HTML tables. As of now it supports checkbox, select, text and date type.
![alt tag](https://raw.github.com/scane/ediTable/master/docs/demo-image.png)

Example

    <table class="ediTable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Mobile</th>
          <th>Status</th>
          <th>Course</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
         <tr>
             <td>Scanny</td>
             <td class="ediTable-exclude">Shiroda</td>
             <td>123456</td>
             <td>active</td>
             <td>computer</td>
             <td>2013-02-10</td>
             <td class="ediTable-exclude">
               <input type="button" class="ediTable-edit" value="edit"/>
               <input type="button" class="ediTable-save" data-update-url="/users/update?id=1" value="save"/>
               <input type="button" class="ediTable-destroy" data-destroy-url="/users/destroy?id=1" value="destroy"/>
             </td>
        </tr>
      </tbody>
    </table>

Edit, Save and Destroy button should have "ediTable-edit", "ediTable-save" and "ediTable-destroy" class respectively. You should also provide data-update-url and data-destroy-url to edit and save as given in the above example. You can exclude a cell from editing by applying a class "editTable-exclude" to its respective cell.

Basic Usage
===========

    $('.ediTable').ediTable({
        fields: [    { name: 'name' },
                     { name: mobile_no },
                     {
                        name: status,
                        type: 'checkbox',
                        labels: ['active','inactive']
                     },
                     {
                         name: course_id,
                         type: 'select',
                         values: [[1,'computer'], [2,'mechanical'],[3,'electronics']]

                     },
                     {
                         name: created_at,
                         type: 'date',
                         options: {
                             dateFormat: 'yy-mm-dd',
                             showAnim: 'slideDown',
                             changeMonth: true,
                             changeYear: true, 
                         }
                     }
        ]
    }); 

If no type is specified for a field, its taken as of type text. Date type suppots all the options which are provided by jquery-ui date-picker http://jqueryui.com/datepicker/

Callbacks
This library expects a json response.

onUpdate: function(response) { .. }
onDestroy: function(response) { .. }

 
