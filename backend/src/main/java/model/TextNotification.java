package model;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;

@Entity
@Inheritance
public class TextNotification extends Notification{
    private String headerText;
    private String text;

    public TextNotification() {
        super();
    }

    public TextNotification(User forUser, User triggeredByUser, String headerText, String text) {
        super(forUser, triggeredByUser);
        this.text = text;
        this.headerText = headerText;
    }

    @Override
    public String toString() {
        return super.toString() + " " + headerText;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getHeaderText() {
        return headerText;
    }

    public void setHeaderText(String headerText) {
        this.headerText = headerText;
    }
}
