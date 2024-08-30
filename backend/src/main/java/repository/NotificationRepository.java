package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Notification;
import io.vertx.ext.mail.MailClient;
import io.vertx.ext.mail.MailMessage;

import java.util.List;

@ApplicationScoped
public class NotificationRepository {
    @Inject
    EntityManager em;

    @Inject
    MailClient client;

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
                "order by n.timestamp desc"
            , Notification.class)
            .setParameter("userId", userId)
            .setMaxResults(50)
            .getResultList();
    }

    @Transactional
    public void sendConfirmationEmail(Notification notification){
        MailMessage message = generateConfirmationMailMessage(notification);

        client.sendMail(message, result -> {
            if (result.succeeded()) {
                System.out.println("Email sent successfully");
            } else {
                System.out.println("Failed to send email: " + result.cause());
            }
        });
    }

    @Transactional
    public MailMessage generateConfirmationMailMessage(Notification notification) {
        //TODO do this with env variables
        String FRONTEND_URL = "http://localhost:4200?notification=true";

        MailMessage message = new MailMessage();
        message.setFrom("iptor.multiflex.academy@gmail.com");
        String email = notification.getForUser().getEmail();
        message.setTo(email);
        message.setSubject("New Notification in Multiflex-Academy");

        message.setHtml("Hi " + notification.getForUser().getUsername() + ",<br><br>" +
                "You have a new notification in Multiflex-Academy.<br><br>" +
                notification + "<br><br>" +
                "Please click <a href=\"" + FRONTEND_URL + "\">here</a> to see your notifications.<br><br>" +
                "Best regards,<br>" +
                "Multiflex-Academy Team");

        return message;
    }

    public Notification getById(Long id){
        return em.find(Notification.class, id);
    }
}
