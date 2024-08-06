package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Customer;

import java.util.List;

@ApplicationScoped
public class CustomerRepository {

    @Inject
    EntityManager em;

    @Transactional
    public void create(Customer customer) {
        em.persist(customer);
    }

    @Transactional
    public void update(Customer customer) {
        em.merge(customer);
    }

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<Customer> getAll() {
        return em.createQuery("select c from Customer c", Customer.class).getResultList();
    }


    public Customer getById(Long id){
        return em.find(Customer.class, id);
    }
}
