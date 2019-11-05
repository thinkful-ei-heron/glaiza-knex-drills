/* eslint-disable no-console */
require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});
console.log('knex and driver installed correctly');

//Select * from amazong_products
knexInstance.from('amazong_products').select('*')
    .then(result => {
        console.log(result);
    });

//Select product_id, name, price, category from amazong_products where name = 'Point of view gun';
const qry = knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where({  name: 'Point of view gun' })
    .first()
    .toQuery();

    console.log(qry);


const searchTerm = 'holo'; 

  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
          console.log(result);
    })
    .catch(err => console.log(err))
    .finally( () => knexInstance.destroy());
      

//function that accepts the searchTerm as a parameter
function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
          console.log(result);
      })
    .catch(err => console.log(err))
    .finally( () => knexInstance.destroy());
}
      
searchByProduceName('holo');

//Paginating Amazong products
function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
        
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
          console.log(result);
    })
    .catch(err => console.log(err))
    .finally( () => knexInstance.destroy());
}
      
paginateProducts(2);

//Filter Amazong products that have images
function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
          console.log(result);
    })
    .catch(err => console.log(err))
    .finally( () => knexInstance.destroy());
}
      
getProductsWithImages();

//Find the most popular Whopipe videos
function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where('date_viewed',
            '>',
            knexInstance.raw('now() - \'?? days\'::INTERVAL', days)
          )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
            { column: 'region', order: 'ASC' },
            { column: 'views', order: 'DESC' },
          ])
    .then(result => {
          console.log(result);
          })
    .catch(err => console.log(err))
    .finally( () => knexInstance.destroy());
}
      
mostPopularVideosForDays(30);