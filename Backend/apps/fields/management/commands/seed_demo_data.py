from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random

from apps.users.models import User
from apps.fields.models import Field, FieldAssignment, FieldObservation


class Command(BaseCommand):
    help = "Seeds the database with demo users, fields, assignments, and observations."

    CROPS = ["Maize", "Wheat", "Beans", "Potatoes", "Rice"]
    STAGES = ["PLANTED", "GROWING", "READY", "HARVESTED"]

    ADMIN = {
        "first_name": "Admin",
        "last_name": "SmartSeason",
        "email": "admin@smartseason.com",
        "password": "admin123",
        "role": User.ADMIN,
    }

    AGENTS = [
        {
            "first_name": "John",
            "last_name": "Kamau",
            "email": "agent1.kamau@smartseason.com",
            "password": "agent123",
            "role": User.AGENT,
        },
        {
            "first_name": "Mary",
            "last_name": "Wanjiku",
            "email": "agent2.wanjiku@smartseason.com",
            "password": "agent123",
            "role": User.AGENT,
        },
        {
            "first_name": "Peter",
            "last_name": "Otieno",
            "email": "agent3.otieno@smartseason.com",
            "password": "agent123",
            "role": User.AGENT,
        },
    ]

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding users...")
        self._seed_user(self.ADMIN)
        for agent in self.AGENTS:
            self._seed_user(agent)

        agents = list(User.objects.filter(role=User.AGENT))
        if not agents:
            self.stdout.write(self.style.ERROR("No agents found — aborting field seed."))
            return

        self.stdout.write("Seeding fields...")
        fields = self._seed_fields()

        self.stdout.write("Assigning fields to agents...")
        self._seed_assignments(fields, agents)

        self.stdout.write("Seeding observations...")
        count = self._seed_observations(fields)

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. {len(fields)} fields, {len(fields)} assignments, {count} observations created."
        ))


    # helpers


    def _seed_user(self, data: dict):
        email = data["email"]
        if User.objects.filter(email=email).exists():
            self.stdout.write(f"  Skipping {email} — already exists.")
            return
        User.objects.create_user(**data)
        self.stdout.write(f"  Created {data['role']}: {email}")

    def _seed_fields(self):
        fields = []
        for i in range(12):
            planting_date = timezone.now().date() - timedelta(days=random.randint(10, 120))
            field = Field.objects.create(
                name=f"Field-{i + 1}",
                crop_type=random.choice(self.CROPS),
                planting_date=planting_date,
                current_stage=random.choice(self.STAGES),
                threshold_days=random.choice([60, 90, 120]),
            )
            fields.append(field)
        self.stdout.write(f"  Created {len(fields)} fields.")
        return fields

    def _seed_assignments(self, fields, agents):
        for i, field in enumerate(fields):
            agent = agents[i % len(agents)]
            FieldAssignment.objects.create(field=field, agent=agent)
        self.stdout.write(f"  Created {len(fields)} assignments.")

    def _seed_observations(self, fields):
        count = 0
        for field in fields:
            assignment = field.assignments.first()
            if not assignment:
                continue
            for _ in range(random.randint(2, 4)):
                FieldObservation.objects.create(
                    field=field,
                    agent=assignment.agent,
                    stage=random.choice(self.STAGES),
                    notes=f"Auto-generated observation for {field.name}",
                )
                count += 1
        self.stdout.write(f"  Created {count} observations.")
        return count