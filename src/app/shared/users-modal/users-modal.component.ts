  subscribers: Subscriber[];
              private modalService: UsersModalService) {
    /**
     * Get users
     */
    this.modalService.getUsers().subscribe((response: ApiResponse<Subscriber>): void => {
      this.subscribers = response.results;
    });
