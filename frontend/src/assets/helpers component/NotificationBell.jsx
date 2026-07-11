

      {open && (
        <div className={s.dropdown}>
          <div className={s.header}>
            <p className={s.headerText}>Notifications</p>
          </div>
          {items.length === 0 ? (
            <p className={s.emptyText}>No notifications yet.</p>
          ) : (
            items.map((n) => (
              <Link
                key={n._id}
                to={n.poll ? `/poll/${n.poll._id}` : "/dashboard"}
                onClick={() => setOpen(false)}
                className={`${s.notificationLink} ${
                  !n.read ? s.notificationUnread : ""
                }`}
              >
                <span className={s.notificationText}>
                  <span className={s.actorName}>
                    @{n.actor?.username}
                  </span>{" "}
                  {verb(n.type)}
                  {n.poll?.question ? (
                    <span className={s.pollPreview}>
                      {" "}
                      · "{n.poll.question.slice(0, 40)}"
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
   