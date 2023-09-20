package com.amakakeru.medihelpbackend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "thread_history")
@Data
public class Thread {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "thread_id")
    private Integer threadId;

    @Column(name = "uploader_id")
    private String uploaderId;

    @Column(name = "thread_title")
    private String threadTitle;

    @Column(name = "thread_body")
    private String threadBody;

    @Column(name = "thread_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
//    @Temporal(TemporalType.TIMESTAMP)
    private Date threadDate;

    @Column(name = "thread_view")
    private Integer threadView;

    @Column(name = "thread_trend_view")
    private Integer threadTrendView;

    @Column(name = "thread_upvote")
    private Integer threadUpvote;

    @Column(name = "thread_downvote")
    private Integer threadDownvote;

}
