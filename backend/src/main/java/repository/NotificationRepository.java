package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Notification;

import java.util.List;

@ApplicationScoped
public class NotificationRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(Notification notification) {
        em.persist(notification);
    }

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    @Transactional
    public void update(Notification notification) {
        em.merge(notification);
    }

    public List<Notification> getAll(Long userId) {
        return em.createQuery(
                "select n from Notification n " +
                "where n.forUser.userId = :userId " +
                "order by n.timestamp asc"
            , Notification.class)
            .setParameter("userId", userId)
            .getResultList();
    }

    public Notification getById(Long id){
        return em.find(Notification.class, id);
    }
}
