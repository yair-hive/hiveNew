export const map_add_presers = {
    seats: function(){
        var cells_list = []
        var selected = document.querySelectorAll('.selected')
        for(let cell of selected){
            var cell_data = {}
            cell_data.row = cell.getAttribute('cell-row') 
            cell_data.col = cell.getAttribute('cell-col')
            cells_list.push(cell_data)
        }
        return cells_list
    },
    elements: function(){
        var selected = document.querySelectorAll('.selected')
        var rows = []
        var cols = []
        for(let cell of selected){
            var row = Number(cell.getAttribute('cell-row')) 
            var col = Number(cell.getAttribute('cell-col'))
            if(rows.indexOf(row) === -1) rows.push(row)
            if(cols.indexOf(col) === -1) cols.push(col)
        }
        cols.sort(function(a, b) { return a - b; }); 
        rows.sort(function(a, b) { return a - b; }); 
        var name = prompt('הכנס שם')
        var from_row = rows[0]
        var from_col = cols[0]
        var to_row = rows[rows.length -1]
        var to_col = cols[cols.length -1]
        var data = {
            name: name, 
            from_row: from_row, 
            from_col: from_col, 
            to_row: to_row, 
            to_col: to_col
        }
        return {data}
    },
    groups: function(){
        var selected = document.querySelectorAll('.selected')
        var rows = []
        var cols = []
        for(let cell of selected){
            var row = Number(cell.getAttribute('cell-row')) 
            var col = Number(cell.getAttribute('cell-col'))
            if(rows.indexOf(row) === -1) rows.push(row)
            if(cols.indexOf(col) === -1) cols.push(col)
        }
        cols.sort(function(a, b) { return a - b; }); 
        rows.sort(function(a, b) { return a - b; }); 
        var name = prompt('הכנס שם')
        var from_row = rows[0]
        var from_col = cols[0]
        var to_row = rows[rows.length -1]
        var to_col = cols[cols.length -1]
        var data = {
            name: name, 
            from_row: from_row, 
            from_col: from_col, 
            to_row: to_row, 
            to_col: to_col
        }
        return {data}
    },
    numbers: function(){
        var col_name = prompt('Please enter number')
        var seatNumber = Number(col_name) + 1
        var elements = document.querySelectorAll('.selected')
        var data = []
        for(let element of elements){
            var seat_id = element.getAttribute('seat_id')
            data.push({id:seat_id, number:seatNumber})     
            seatNumber++
        }
        return {data:data}
    },
    tags: function(){
        var selected = document.querySelectorAll('.selected')
        var tag_name = prompt('הכנס שם תווית')
        var seats = []
        for(let i = 0; i < selected.length; i++){
            var seat = selected[i]
            var seat_id = seat.getAttribute('seat_id')
            seats.push(seat_id)
        }
        return {seats: seats, tag_name:tag_name}
    }
} 