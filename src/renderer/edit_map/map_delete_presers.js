export const map_delete_presers = {
    seats: function(){
        var selected = document.querySelectorAll('.selected')
        var seats_ids = []
        for(let seat of selected){
            var seat_id = seat.getAttribute('seat_id')
            seats_ids.push(seat_id)
        }
        return seats_ids
    },
    elements: function(){
        var selected = document.querySelectorAll('.selected')
        var elements_ids = []
        for(let element of selected){
            var element_id = element.getAttribute('element_id')
            elements_ids.push(element_id)
        }
        return elements_ids
    }
}