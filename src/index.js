import { Participant } from "./model/Participant.js";
import { createStore } from "redux";
import tether from "tether";
import $ from "jquery";
// dependency hotfixes
global.jQuery = $;
global.Tether = tether;
require('bootstrap');
window.Tether = function() { throw new Error('Your Bootstrap may actually need Tether.'); }; // this one is an act of EVIL

// view - simple renderer
function render(cashbox, overallParticipants, selectedParticipants, removeCallback, joinCallback) {
    //console.log(cashbox);
    let sum = cashbox.Total;
    let cashboxList = $("#cashboxList");
    let participantsList = $("#participantsList");
    let totalParticipantsList = $("#totalParticipantsList");
    cashboxList.empty();
    participantsList.empty();
    totalParticipantsList.empty();
    participantsList.append("<option value=\"\">-- vyberte --</option>");
    selectedParticipants.forEach(element => {
        participantsList.append("<option value=\"" + element.Name + "\">" + element.Name + "</option>");
    });

    if (cashbox.Items != null)
        cashbox.Items.forEach(item => {
            cashboxList.append("<tr><td>" + item.Name + "</td><td>" + item.Amount + "</td><td>" + item.Note + "</td><td><button class=\"btn btn-danger btn-sm removeRecord\" data-record=\"" + item.Id + "\">Odstranit</button></td></tr>");
        });
    overallParticipants.forEach((item, index) => {
        let itemString = "<tr><td>" + item.Name + "</td><td>" + ((selectedParticipants.indexOf(item) < 0) ? "<button class=\"btn btn-success btn-sm addUser\" data-id=\"" + index + "\">Přidat</button>" : "") + "</td></tr>";
        totalParticipantsList.append(itemString);
    });
    $("#totalSum").text(sum);
    $(".removeRecord").click(removeCallback);
    $(".addUser").click(function() {
        joinCallback($(this).data("id"));
    });
}
function onJoin(id) {
    store.dispatch({ type: "JOIN", participant: overallParticipants[id] });
}
$(".newParticipants").click(function() {
    $('#participantsModal').modal({ focus: true });
});

// application reducer function
function process(state, action) {

    switch (action.type) {
        case "JOIN":
            {
                let participants = state.Participants;
                participants.push(action.participant);
                return {...state, Participants: participants };
            }
        case "ADD":
            {
                var CB = new CashBox(state.Cashbox.Items, state.Cashbox.Total);
                CB.CreateNewRecord(action.Name, action.Amount, 1, action.Note);
                return { ...state, CashBox: CB };
            }
        case "DELETE":
            {
                var CB = new CashBox(state.Cashbox.Items, state.Cashbox.Total);
                CB.RemoveRecord(action.Id);
                return { ...state, CashBox: CB };
            }
        default:
            return state;
    }
}

//initialisation
const overallParticipants = [
    new Participant("Jiří", "Vomáčka", "A"),
    new Participant("Alena", "Potůčková", "A"),
    new Participant("Petr", "Houska", "A"),
    new Participant("Martin", "Tichý", "A"),
];

const store = createStore(process, { Cashbox: new CashBox(), Participants: [] });

store.subscribe(function() {
    var state = store.getState();
    render(state.Cashbox, overallParticipants, state.Participants, onRemove, onJoin);
});

//init <select><option>
store.dispatch({ type: "JOIN", participant: overallParticipants[0] });

//remove after Cashbox class created!!!
//function Cashbox() {
//      
//}

//todo add/delete redux actions (call dispatch method)
function onRemove(e) {
    store.dispatch({ type: "DELETE", Id:e.target.id });
}

function onAdd(name,amount,note) {
    store.dispatch({ type: "ADD", Name: name,Amount:amount,Note:note});
}


document.getElementById("addRecord").addEventListener("click", (e) => { onAdd(document.getElementById("participantsList").value,document.getElementById("newAmount").value, document.getElementById("newNote").value); })