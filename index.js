const exp = require('express');
const app = exp();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(exp.static('public'));

// ================================================================================================

var department = ['Otolaryngologist','Immunologists','Dermatologist','Hepatologist','Allergist','Rheumatologist','Pulmonologist',
'Orthopaedists','Infectious disease specialist','Hepatologist','General Physician','General Physician','Endocrinologist',
'Gastroenterologist','Allergist','Infectious disease specialist','Otolaryngologist','Gastroenterologist','Cardiologist','Hepatologist',
'Hepatologist','Hepatologist','Hepatologist','General Physician','Endocrinologist','Endocrinologist',
'Endocrinologist','General Physician','Gastroenterologist','Infectious disease specialist','General Physician',
'Orthopaedician','Neurologist','Gastroenterologist','Pulmonologist','Dermatologist','Infectious disease specialist',
'General Physician','Urologist','Cardiologist','Hepatologist','General Physician','Physical Trainer'
];

// ================================================================================================

// mongoose.connect('mongodb+srv://tej:tej@cluster0.uxnrl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
mongoose.connect('mongodb://localhost:27017/user',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{console.log("Database Added");})
.catch(err=>{console.log(err,'this is error');})

////    User Database
var UserSchema = new mongoose.Schema({
    name:String,
    age:Number,
    email:String,
    sex:String,
    height:Number,
    weight:Number,
    temp:Number,
    dob:String,
    sm:Number,
    al:Number,
    ph:Number,
    bmi:Number,
    ubp:Number,
    lbp:Number,
    chol:String,
    gulc:String,
    gul:Number,
    ch:Number,
    gd:Number,
    ag:Number,
    book1:String,
    book2:String,
    bookphy:String,
    booktrain:String,
    data:[{type:String}],
    perc:[{type:String}],
    ab:[{type:Number}]
});
var User = mongoose.model("User",UserSchema);

// ////    Slot Database
// var slotSchema = new mongoose.Schema({
//     '10:00 AM' : {type:Boolean, default:false},
//     '10:30 AM' : {type:Boolean, default:false},
//     '11:00 AM' : {type:Boolean, default:false},
//     '11:30 AM' : {type:Boolean, default:false},
//     '12:00 NOON' : {type:Boolean, default:false},
//     '12:30 PM' : {type:Boolean, default:false},
//     '01:00 PM' : {type:Boolean, default:false},
//     '01:30 PM' : {type:Boolean, default:false},
//     '03:00 PM' : {type:Boolean, default:false},
//     '03:30 PM' : {type:Boolean, default:false},
// });
// var Slot = mongoose.model('slot',slotSchema);

////    Department Database
var AppointmentSchema = new mongoose.Schema({
    Deprt: String,
    slot: [{type:Number}]
});
var Appoint = mongoose.model('appoint',AppointmentSchema);

p = [];
i=0;
department.forEach(element => {
    y = p.find((x)=>x===element);
    if(y){}
    else{
        p.push(element);
        Appoint.find({Deprt:""+ element},(err,f)=>{
            if(f.length!==0){}
            else{
                console.log(i);
                i+=1;
                Appoint.create({Deprt:element},()=>{});
            }
        })
    }
});
// Appoint.create({Deprt:"Radio"},()=>{});
// Appoint.findOne({Deprt:"Radio"},function(err,found){
//     found.slot.push(2);
//     found.save(()=>{});
// });

////    New Symptoms Database
var sympSchema = new mongoose.Schema({symptom:String});
var Symp = mongoose.model('symps',sympSchema);

// ================================================================================================
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function CTime(x){
    sol = '';
    if(x>10)sol='03:/0 PM';
    else if(x>8)sol='02:/0 PM';
    else if(x>6)sol='01:/0 PM';
    else if(x>4)sol='12:/0 PM';
    else if(x>2)sol='11:/0 AM';
    else sol='10:00 AM';
    if(x==2||x==4||x==6||x==8||x==10||x==12){sol = sol.replace('/','3');}
    else {sol = sol.replace('/','0');}
    return sol;
}

var name="",age=0,email="",sex="",hgt=0,wgt=0,temp=0,dob="",smoke="",alcohol="",physc="",bmi=0;
var ag=50*365,hg=170,wi=70,gd=2,sb=120,db=80,ch=1,gl=1,sm=1,al=1,ph=1;
var ubp=0,lbp=0,gul=0,chol=0;
var data2=0;

var data=[];var ab=[];
var perc=[];

// ================================================================================================

app.get('/',(req,res)=>{res.render("home.ejs");})

app.get('/detail',(req,res)=>{res.render("detail.ejs");})

app.post('/for',(req,res)=>{
    name = req.body.fname+" "+req.body.sname;
    email = req.body.email;
    dob = req.body.age;
    age = getAge(dob);
    var newUser = new User({name:name,email:email,dob:dob,age:age,book1:'0',book2:'0',bookphy:'0',booktrain:'0'});
    newUser.save((err,usr)=>{
        if(err){
            // console.log(err)
            res.send("Error Page");
        }
        else{
            id = usr._id;
            next = '/for/'+id;
            res.redirect(next);
        }
    })
})

app.get('/for/:id',(req,res)=>{
    res.render("for.ejs",{id:req.params.id});
})

app.get('/gender/:id',(req,res)=>{
    res.render("gender.ejs",{id:req.params.id});
})

app.post('/gentest/:id',(req,res)=>{
    var gender = req.body;
    if(gender.male=='male')sex='male';
    else sex='female';
    
    User.findByIdAndUpdate(req.params.id,{sex:sex},function (err,update){
        // console.log(update);
        res.redirect("/gentest/"+req.params.id);
    })
})
app.get('/gentest/:id',(req,res)=>{
    console.log(req.params.id);
    res.render("gentest.ejs",{id:req.params.id});
})

app.post('/hw/:id',(req,res)=>{
    ubp = req.body.ubp;
    lbp = req.body.lbp;
    gul = req.body.Glucose;
    chol = req.body.Cholesterol;

    // console.log(gul,chol);

    if(ubp<10||ubp>200)ubp=120;
    if(lbp<10||lbp>200)lbp=80;

    User.findByIdAndUpdate(req.params.id,{ubp:ubp,lbp:lbp,gulc:gul,chol:chol},function (err,update){
        // console.log(update);
        res.redirect('/hw/'+req.params.id);
    })
})
app.get('/hw/:id',(req,res)=>{res.render("hw.ejs",{id:req.params.id});})

app.post('/temp/:id',(req,res)=>{
    hgt = req.body.hgt;
    wgt = req.body.wgt;
    h = hgt/100;
    bmi = (wgt/(h*h)).toFixed(2);
    
    User.findByIdAndUpdate(req.params.id,{height:hgt,weight:wgt,bmi:bmi},function(err,update){
        // console.log(update);
        res.redirect('/temp/'+req.params.id);
    })
})
app.get('/temp/:id',(req,res)=>{res.render("temp.ejs",{id:req.params.id});})

app.post('/misc/:id',(req,res)=>{
    var t = req.body;
    if(t.x95=='')temp=95;
    else if(t.x98=='98')temp=98;
    else if(t.x101=='101')temp=101;
    else if(t.x103=='103')temp=103;
    else if(t.x105=='105')temp=105;

    User.findByIdAndUpdate(req.params.id,{temp:temp},function(err,update){
        // console.log(update);
        res.redirect('/misc/'+req.params.id);
    })
})
app.get('/misc/:id',(req,res)=>{
    res.render('misc.ejs',{id:req.params.id});
})

app.post('/symptoms/:id',(req,res)=>{
    smoke = req.body.smoke;
    alcohol = req.body.alcohol;
    physc = req.body.physc;
    // console.log(smoke,alcohol,physc);

    ag = age*365;
    gd = sex === 'male'? 2 : 1;
    hg = hgt;
    wi = wgt;
    sb = ubp;
    db = lbp;
    if(chol==='norm')ch=1;
    else if(chol==='abvnor')ch=2;
    else ch=3;
    if(gul==='norm')gl=1;
    else if(gul==='abvnor')gl=2;
    else gl=3;
    sm = smoke==='yes'?1:0;
    al = alcohol==='yes'?1:0;
    ph = physc==='yes'?1:0;

    User.findById(req.params.id,function(err,found){
        ag = found.age * 365;
        gd = found.sex === 'male'? 2 : 1;
        if(found.chol==='norm')ch=1;
        else if(found.chol==='abvnor')ch=2;
        else ch=3;
        if(found.gulc==='norm')gl=1;
        else if(found.gulc==='abvnor')gl=2;
        else gl=3;
    })

    User.findByIdAndUpdate(req.params.id,{ag:ag,gd:gd,ch:ch,gul:gl,sm:sm,al:al,ph:ph},function(err,update){
        res.redirect('/symptoms/'+req.params.id);
    })
})
app.get('/symptoms/:id',(req,res)=>{
    User.findById(req.params.id,function(err,found){
        if(found){
            res.render("symptoms.ejs",{ag:found.ag,hg:found.height,wi:found.weight,gd:found.gd,sb:found.ubp,db:found.lbp,ch:found.ch,gl:found.gul,sm:found.sm,al:found.al,ph:found.ph,id:req.params.id});
        }
        else{
            res.send("Error Page");
        }
    })
})

app.post('/addsymp/:id',(req,res)=>{
    Symp.create({symptom:req.body.symptom},function(){});
    res.redirect('/addsymp/'+req.params.id);
})
app.get('/addsymp/:id',(req,res)=>{
    res.render('addsymp.ejs',{id:req.params.id});
})

app.post("/results/:id",(req,res)=>{
    data=[];perc=[];ab=[];
    data.push(req.body.a);perc.push(req.body.a1);
    data.push(req.body.b);perc.push(req.body.b1);
    data.push(req.body.c);perc.push(req.body.c1);
    data.push(req.body.d);perc.push(req.body.d1);
    data.push(req.body.e);perc.push(req.body.e1);
    ab.push(req.body.f1);ab.push(req.body.f2);

    data2 = req.body.new;
    // console.log(data2);

    console.log(data, 'data');
    console.log(perc,'perc');
    console.log(ab,'ab');

    // console.log(name,age,email,sex,hgt,wgt,temp,dob,smoke,alcohol,physc,bmi);
    // console.log(ubp,lbp,gul,chol);

    User.findById(req.params.id,function(err,f){
        if(f){
            f.data = [];f.book1='';f.book2='';
            f.perc = [];f.bookphy='';f.booktrain='';
            f.ab = [];
            f.data.push(data[0]);f.data.push(data[1]);f.data.push(data[2]);
            f.data.push(data[3]);f.data.push(data[4]);
            f.perc.push(parseFloat(perc[0]));f.perc.push(parseFloat(perc[1]));
            f.perc.push(parseFloat(perc[2]));f.perc.push(parseFloat(perc[3]));
            f.perc.push(parseFloat(perc[4]));
            f.ab.push(parseInt(ab[0]));f.ab.push(parseInt(ab[1]));
            f.save(()=>{});
        }
    })


    res.redirect('/res/'+req.params.id);
})



app.get('/results/:id',(req,res)=>{
    User.findById(req.params.id,function(err,found){
        if(found){
            res.render("result",{name:found.name,age:found.age,dob:found.dob,email:found.email,sex:found.sex,bmi:found.bmi,
                result:found.data,perc:found.perc,ab:found.ab,data2:data2,book1:found.book1,book2:found.book2,bookphy:found.bookphy,booktrain:found.booktrain,
                id:req.params.id    
            });
        }
        else{res.send("Error Page");}
    })
})

app.post('/slot/:id/:deprt',(req,res)=>{
    // console.log(req.body);
    Appoint.findOne({Deprt:req.params.deprt},function(err,found){
        found.slot.push(parseInt(req.body.name));
        found.save(()=>{
            User.findById(req.params.id,function(err,found){
                tm = CTime(parseInt(req.body.name));
                if(req.params.deprt==='General Physician'){
                    found.bookphy = tm;
                    found.save(()=>{});
                }
                else if(req.params.deprt==='Physical Trainer'){
                    found.booktrain = tm;
                    found.save(()=>{});
                }
                else if(found.book1.length<3){
                    found.book1 = tm;
                    found.save(()=>{});
                }
                else{
                    found.book2 = tm;
                    found.save(()=>{});
                }
            })
        });
    });
    res.redirect('/res/'+req.params.id);
})

app.get('/res/:id',(req,res)=>{
    res.redirect('/results/'+req.params.id);
})

app.get('/slot/:id/:deprt',(req,res)=>{
    // Appoint.find({},(e,f)=>{console.log(f);})
    // console.log(req.params.deprt);
    Appoint.findOne({Deprt:req.params.deprt},function(err,f){
        // console.log(f);
        if(f){
            res.render('slot.ejs',{id:req.params.id,deprt:req.params.deprt,slot:f.slot});
        }
        else{res.send('Error Page');}
    })
})

app.listen(process.env.PORT||3000,process.env.IP,()=>{
    console.log("Server");
})

// ====================================================================================================

// Place for hospital Management System

app.get('/hms',(req,res)=>{
    patients = [];
    User.find({},(e,f1)=>{
        f1.forEach(f=>{
            patients.push(f.name);
            console.log(patients);
            // console.log(f.name);
        })
        res.render('hms.ejs',{patient:patients});
    })
})