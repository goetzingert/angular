'use strict';

var express = require('express');
var _ = require('lodash');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json())

var counter = 3;

var bookings = {};



var customers = {
  0: {id: 0, firstname: "Hans", lastname: "Maulwurf", street: "Evergreen Terrace 742", zip: "12345", city: "Springfield", imageUrl: "assets/images/customers/customer1.png", discontinued: false, lastOrderDate: nowPlusDays(-10)},
  1: {id: 1, firstname: "Lisa", lastname: "Simpson", street: "Evergreen Terrace 742", zip: "12345", city: "Springfield", imageUrl: "assets/images/customers/customer2.png", discontinued: false, lastOrderDate: nowPlusDays(-2)},
  2: {id: 2, firstname: "C. Montgomery", lastname: "Burns", street: "Nuclear Plant", zip: "54321", city: "Springfield", imageUrl: "assets/images/customers/customer3.png", discontinued: true, lastOrderDate: nowPlusDays(-365)}
};




var pigs = {
  0: {id: 0, name: "Miss Piggy",},
  1: {id: 1, name: "Schweinchen Dick"}
};

function nowPlusDays(days) {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * days);
}


app.get('/api/pigs', function(req, res){
  var pigArray = _.values(pigs);
  res.send({ data: pigArray});
});

app.get('/api/customer', function(req, res){
  var customerArray = _.values(customers);
  res.send({ data: customerArray});
});

app.post('/api/customer', function (req, res) {
  var id = counter++;
  var customer = req.body;

  customer.id = id;

  console.log('Adding customer to collection: %j', customer);
  customers[customer.id] = customer;

  res.send({ data: customer });
});

app.get('/api/customer/:id', function (req, res) {
  var id = req.param('id');

  if (customers[id]) {
    var customer = customers[id];
    res.send({ data: customer });
  }
  else {
    res.status(404);
    res.send();
  }
});

app.put('/api/customer/:id', function (req, res) {
  var id = req.param('id');
  var customer = req.body;
  customer.id = +id;

  console.log('Updating customer in collection: %j', customer);

  if (customers[id]) {
    customers[id] = customer;
    res.send({ data: customer });
  }
  else {
    res.status(404);
    res.send();
  }
});

app.patch('/api/customer/:id', function (req, res) {
  var id = +req.param('id');
  var customer = customers[id];
  var patch = req.body;

  console.log('Updating customer in collection: %j', customer);

  if (customer) {
    delete patch.id;
    Object.assign(customer, patch);
    res.send({ data: customer });
  }
  else {
    res.status(404);
    res.send();
  }
});

app.delete('/api/customer/:id', function (req, res) {
  var id = req.param('id');
  
  if (customers[id]) {
    console.log('Removing customer from collection: %j', customers[id]);

    delete customers[id];
    res.status(200);
  }
  else {
    res.status(404);
  }

  res.send();
});

app.post('/api/booking', function (req, res) {
  var id = counter++;
  var booking = req.body;

  booking.id = id;

  console.log('Adding booking to collection: %j', booking);
  bookings[booking.id] = booking;

  res.send({ data: booking });
});

app.get('/api/booking', function(req, res){
  var bookingsArray = _.values(bookings);
  res.send({ data: bookingsArray});
});


app.get('/api/booking/:id', function (req, res) {
  var id = req.param('id');

  if (bookings[id]) {
    var booking = bookings[id];
    res.send({ data: booking });
  }
  else {
    res.status(404);
    res.send();
  }
});



var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
