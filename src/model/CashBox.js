class CashBoxRecordsData {
    constructor(Name,Amount,Id,Note) {
        this.Name;
        this.Amount;
        this.Id
        this.Note;
    }
}

class CashBox()
{
    constructor(Items=[],Total=0)
    {
        this.Items = [];
        this.Total;
    }

    CreateNewRecord(Name,Amount,Id,Note)
    {
        var CashboxRecord = new CashBoxRecordsData(Name, Amount, Id, Note);
        this.Items.push(CashboxRecord);
    }

    GetTotalAmount()
    {
        this.Total = 0;
        for (var i = 0; i < this.Items.length; i++)
        {
            TotalAmount = TotalAmount + this.Items[i].Amount;
        }
        return this.Total;
    }

    RemoveRecord(id)
    {
        for (var i = 0; i < this.Items.length; i++) {
            if (this.Items[i].Id == id)
            {
                this.Items.splice(id, 1);
            }
        }
    }
}