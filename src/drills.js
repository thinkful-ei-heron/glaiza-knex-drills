/* eslint-disable no-console */
require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

//1. Get all items that contain text
//Select * from shopping_list where name ilike '%fish%';
function getItemsByName(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(`Search Term ${searchTerm}`);
            console.log(result);
        })
        .catch(err => console.log(err))
        .finally(() => knexInstance.destroy());
}
          
getItemsByName('fish');

//2. Get all items paginated
//Select * from shopping_list limit 6 offset 2;
function getItemsPaginate(pageNumber) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);
    knexInstance
      .select('*')
      .from('shopping_list')
      .limit(productsPerPage)
      .offset(offset)
      .then(result => {
        console.log(`Paginate Items ${pageNumber}`);
        console.log(result);
      })
      .catch(err => console.log(err))
      .finally(() => knexInstance.destroy());
  }
  
  getItemsPaginate(2);

//3. Get all items added after date
  function getItemsAddedDaysAgo(daysAgo) {
    knexInstance
      .select('id', 'name', 'price', 'date_added', 'checked', 'category')
      .where(
        'date_added',
        '>',
        knexInstance.raw('now() - \'?? days\'::INTERVAL', daysAgo)
      )
      .from('shopping_list')
      .then(result => {
        console.log('Products added days ago');
        console.log(result);
      })
      .catch(err => console.log(err))
      .finally(() => knexInstance.destroy());
  }
  
  getItemsAddedDaysAgo(10);

  //4. Get the total cost for each category
  function getTotalCost() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .orderBy([
            { column: 'total', order: 'DESC' },
        ])
        .then(result => {
          console.log('Cost per Category');
          console.log(result);
        })
        .catch(err => console.log(err))
        .finally(() => knexInstance.destroy());
}

getTotalCost();