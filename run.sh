run() {
  if test -d ./secrets && test -f ./secrets/db_name.txt && test -f ./secrets/db_password.txt && test -f ./secrets/db_url.txt && test -f ./secrets/db_user.txt; then
    docker compose up -d
  else
    mkdir secrets
    echo "school_db" > secrets/db_name.txt
    echo "postgres" > secrets/db_password.txt
    echo "postgres" > secrets/db_user.txt
    echo "postgresql://postgres:postgres@db:5432/school_db?schema=public" > secrets/db_url.txt

    docker compose up -d
  fi
}

run