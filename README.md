# parking_spot

I created this little project during my studies.
The goal of the project was to develop a web application simulating the reservation of parking spaces (individually or in the form of a subscription) in the city of Paris. The application will offer users a cartographic visualization of Paris car parks in the form of markers.

We only had to develop the front-end part.

Please find below all the instructions given relating to the development of the application.

## Project guidelines:

#### Home page :
This page displays a slider presenting images highlighting your application.

#### Map:
Below the slider is a map created using Microsoft's Bing Maps API. Before you can use it, you must obtain a user key at https://www.bingmapsportal.com/. This map will present, in the form of markers, the Parisian car parks. The necessary information must come from the Paris OpenData API.

#### Information panel:
Clicking on one of the markers displays the relevant information for the car park concerned (name, address, telephone, opening hours, different accessibility.) Then offers 2 buttons (unit reservation or subscription (if the car park offers it)).

#### Reservation / subscription:
In the case of a single reservation, a tabular display of the different possibilities (Type, price, etc.) will be made from the data provided by the API. This interface will allow you to book on a certain date and will display the price. It is not necessary to develop the sending and processing of the order.

In the case of a subscription, a display in tabular form of the different possibilities (Type, price, etc.) will be made from the data provided by the API. This interface will allow you to book on a certain date and will display the price.
